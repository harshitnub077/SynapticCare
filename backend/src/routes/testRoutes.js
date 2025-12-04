const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const ocrService = require('../services/ocrService');
const fs = require('fs').promises;

// Test OCR endpoint
router.post('/test-ocr', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('[OCR Test] File received:', req.file.originalname);
        console.log('[OCR Test] File path:', req.file.path);
        console.log('[OCR Test] File type:', req.file.mimetype);

        // Extract text
        const result = await ocrService.extractText(req.file.path, req.file.mimetype);

        console.log('[OCR Test] Extraction successful');
        console.log('[OCR Test] Text length:', result.text?.length || 0);
        console.log('[OCR Test] First 200 chars:', result.text?.substring(0, 200));

        // Clean up
        await fs.unlink(req.file.path);

        res.json({
            success: true,
            extractedText: result.text,
            textLength: result.text?.length || 0,
            confidence: result.confidence,
            preview: result.text?.substring(0, 500)
        });
    } catch (error) {
        console.error('[OCR Test] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
