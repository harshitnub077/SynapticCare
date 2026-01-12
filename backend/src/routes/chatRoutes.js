const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Historical Pulse Endpoints
router.get("/history", chatController.getChatHistory);
router.get("/history/:id", chatController.getConversationMessages);

// Transmission Control
router.post("/", chatController.sendMessage);
router.delete("/", chatController.clearChatHistory);

module.exports = router;
