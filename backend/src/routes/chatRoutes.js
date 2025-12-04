const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", chatController.getChatHistory);
router.post("/", chatController.sendMessage);
router.delete("/", chatController.clearChatHistory);

module.exports = router;
