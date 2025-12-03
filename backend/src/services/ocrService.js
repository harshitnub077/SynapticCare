const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const fs = require("fs").promises;

class OCRService {
    /**
     * Extract text from PDF file
     */
    async extractFromPDF(filePath) {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            return {
                text: data.text,
                pages: data.numpages,
                info: data.info,
            };
        } catch (error) {
            console.error("PDF extraction error:", error);
            throw new Error("Failed to extract text from PDF");
        }
    }

    /**
     * Extract text from image using Tesseract OCR
     */
    async extractFromImage(filePath) {
        try {
            const result = await Tesseract.recognize(filePath, "eng", {
                logger: (m) => console.log(m),
            });

            return {
                text: result.data.text,
                confidence: result.data.confidence,
            };
        } catch (error) {
            console.error("Image OCR error:", error);
            throw new Error("Failed to extract text from image");
        }
    }

    /**
     * Main extraction method - detects file type and extracts accordingly
     */
    async extractText(filePath, fileType) {
        if (fileType === "application/pdf") {
            return await this.extractFromPDF(filePath);
        } else if (fileType.startsWith("image/")) {
            return await this.extractFromImage(filePath);
        } else {
            throw new Error("Unsupported file type");
        }
    }
}

module.exports = new OCRService();
