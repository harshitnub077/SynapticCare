const { prisma } = require("../utils/prismaClient");
const aiService = require("../services/aiService");

const getChatHistory = async (req, res) => {
    try {
        const messages = await prisma.chatMessage.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "asc" },
        });
        res.json({ messages });
    } catch (error) {
        console.error("Get chat history error:", error);
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Save user message
        const userMessage = await prisma.chatMessage.create({
            data: {
                userId: req.userId,
                role: "user",
                message: message,
            },
        });

        // Get AI response
        // Fetch recent history for context (last 10 messages)
        const history = await prisma.chatMessage.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        // Reverse to chronological order
        const context = history.reverse().map(m => ({
            role: m.role,
            content: m.message
        }));

        console.log(`[Chat] Getting AI response for user ${req.userId}, context length: ${context.length}`);
        const aiResponseText = await aiService.getChatResponse(message, context);
        console.log(`[Chat] AI response received, length: ${aiResponseText?.length || 0}`);

        // Save AI response
        const aiMessage = await prisma.chatMessage.create({
            data: {
                userId: req.userId,
                role: "assistant",
                message: aiResponseText,
            },
        });

        res.json({
            userMessage,
            aiMessage
        });
    } catch (error) {
        console.error("[Chat] Send message error:", error.message);
        console.error("[Chat] Stack trace:", error.stack);
        res.status(500).json({ message: "Failed to process message", error: error.message });
    }
};

const clearChatHistory = async (req, res) => {
    try {
        await prisma.chatMessage.deleteMany({
            where: { userId: req.userId },
        });
        res.json({ message: "Chat history cleared successfully" });
    } catch (error) {
        console.error("Clear chat history error:", error);
        res.status(500).json({ message: "Failed to clear chat history" });
    }
};

module.exports = {
    getChatHistory,
    sendMessage,
    clearChatHistory,
};
