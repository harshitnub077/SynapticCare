const { prisma } = require("../utils/prismaClient");
const ocrService = require("../services/ocrService");
const parserService = require("../services/parserService");
const aiService = require("../services/aiService");

const uploadReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Create report record
        const report = await prisma.report.create({
            data: {
                userId: req.userId,
                filename: req.file.originalname,
                filepath: req.file.path,
                filetype: req.file.mimetype,
                filesize: req.file.size,
                status: "processing",
            },
        });

        // Process in background (simplified - in production use queue)
        processReport(report.id, req.file.path, req.file.mimetype).catch((error) => {
            console.error("Report processing error:", error);
        });

        res.status(201).json({
            message: "Report uploaded successfully",
            report: {
                id: report.id,
                filename: report.filename,
                status: report.status,
                uploadedAt: report.uploadedAt,
            },
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Failed to upload report", error: error.message });
    }
};

const processReport = async (reportId, filePath, fileType) => {
    try {
        console.log(`[${reportId}] Starting OCR extraction for ${fileType}...`);
        
        // Extract text using OCR
        const extracted = await ocrService.extractText(filePath, fileType);
        const extractedText = extracted.text || "";

        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error("No text could be extracted from the image. Please ensure the image is clear and readable.");
        }

        console.log(`[${reportId}] ✅ OCR Complete: Extracted ${extractedText.length} characters from entire image`);
        console.log(`[${reportId}] Sample of extracted text (first 200 chars): ${extractedText.substring(0, 200)}...`);

        // Parse and analyze the extracted text
        const analysis = parserService.analyze(extractedText);
        
        console.log(`[${reportId}] Parsed ${analysis.parsedData.length} test results, found ${analysis.flags.length} abnormalities.`);

        // Get AI insights using Gemini
        // Pass both parsed data and raw text for comprehensive analysis
        console.log(`[${reportId}] Requesting AI analysis...`);
        const aiInsights = await aiService.analyzeReport(
            analysis.parsedData, 
            analysis.flags,
            extractedText // Pass raw text as fallback context
        );

        // Update report with all extracted data
        await prisma.report.update({
            where: { id: reportId },
            data: {
                extractedText: extractedText,
                parsedData: analysis.parsedData,
                flags: {
                    abnormalities: analysis.flags,
                    aiInsights: aiInsights,
                },
                status: "done",
            },
        });

        console.log(`[${reportId}] ✅ Report processed successfully with AI summary`);
    } catch (error) {
        console.error(`[${reportId}] ❌ Failed to process report:`, error.message);
        await prisma.report.update({
            where: { id: reportId },
            data: { 
                status: "error",
                extractedText: error.message || "Processing failed",
            },
        });
    }
};

const getReports = async (req, res) => {
    try {
        const { page = 1, limit = 10, flagged } = req.query;
        const skip = (page - 1) * limit;

        const where = { userId: req.userId };
        if (flagged === "true") {
            where.flags = { not: null };
        }

        const reports = await prisma.report.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { uploadedAt: "desc" },
            select: {
                id: true,
                filename: true,
                uploadedAt: true,
                status: true,
                flags: true,
            },
        });

        const total = await prisma.report.count({ where });

        res.json({
            reports,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get reports error:", error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await prisma.report.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json({ report });
    } catch (error) {
        console.error("Get report error:", error);
        res.status(500).json({ message: "Failed to fetch report" });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await prisma.report.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await prisma.report.delete({ where: { id } });

        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Delete report error:", error);
        res.status(500).json({ message: "Failed to delete report" });
    }
};

module.exports = {
    uploadReport,
    getReports,
    getReportById,
    deleteReport,
};
