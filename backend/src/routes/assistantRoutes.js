const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    sendMessage,
    getChatHistory,
    clearChatHistory,
} = require("../controllers/assistantController");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post("/chat", sendMessage);
router.get("/history", getChatHistory);
router.delete("/history", clearChatHistory);

module.exports = router;
