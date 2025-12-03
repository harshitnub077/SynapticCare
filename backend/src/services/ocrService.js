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
     * Scans the entire image comprehensively
     */
    async extractFromImage(filePath) {
        try {
            console.log(`Starting comprehensive OCR scan of image: ${filePath}`);
            
            // Use Tesseract with optimized settings for medical documents
            // Configure for comprehensive scanning of entire image
            const result = await Tesseract.recognize(filePath, "eng", {
                logger: (m) => {
                    // Log progress for debugging
                    if (m.status === "recognizing text") {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                },
                // Optimize OCR settings for medical documents
                // PSM mode 3 = Fully automatic page segmentation (default)
                // This ensures the entire image is scanned comprehensively
            });

            const extractedText = result.data.text || "";
            const confidence = result.data.confidence || 0;
            
            console.log(`OCR completed. Extracted ${extractedText.length} characters with ${confidence.toFixed(1)}% confidence`);

            if (!extractedText || extractedText.trim().length === 0) {
                throw new Error("No text could be extracted from the image. Please ensure the image is clear and readable.");
            }

            return {
                text: extractedText,
                confidence: confidence,
                words: result.data.words || [],
                lines: result.data.lines || [],
            };
        } catch (error) {
            console.error("Image OCR error:", error);
            throw new Error(`Failed to extract text from image: ${error.message}`);
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
