const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
    uploadReport,
    getReports,
    getReportById,
    deleteReport,
} = require("../controllers/reportController");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Upload route with error handling
router.post("/", (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            // Handle multer errors
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({ message: "File size exceeds 10MB limit" });
                }
                return res.status(400).json({ message: err.message });
            }
            // Handle other errors
            return res.status(400).json({ message: err.message || "File upload failed" });
        }
        next();
    });
}, uploadReport);
router.get("/", getReports);
router.get("/:id", getReportById);
router.delete("/:id", deleteReport);

module.exports = router;
