const express = require("express");
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

router.post("/", upload.single("file"), uploadReport);
router.get("/", getReports);
router.get("/:id", getReportById);
router.delete("/:id", deleteReport);

module.exports = router;
