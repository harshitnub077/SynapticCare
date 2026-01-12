const { prisma } = require("../utils/prismaClient");
const aiService = require("../services/aiService");

const getChatHistory = async (req, res) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(conversations);
    } catch (error) {
        console.error("Get chat history error:", error);
        res.status(500).json({ message: "Failed to fetch session history" });
    }
};

const getConversationMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await prisma.chatMessage.findMany({
            where: {
                conversationId: id,
                userId: req.userId
            },
            orderBy: { createdAt: "asc" },
        });
        res.json({ messages });
    } catch (error) {
        console.error("Get conversation messages error:", error);
        res.status(500).json({ message: "Failed to fetch transmission logs" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { message, chatId } = req.body;
        const userId = req.userId;

        if (!message) {
            return res.status(400).json({ message: "Transmission rejected: Signal empty." });
        }

        let conversationId = chatId;

        // 1. Create conversation if not exists
        if (!conversationId) {
            const conversation = await prisma.conversation.create({
                data: {
                    userId,
                    title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
                }
            });
            conversationId = conversation.id;
        }

        // 2. Save User Message
        await prisma.chatMessage.create({
            data: {
                userId,
                conversationId,
                role: "user",
                message
            },
        });

        // 3. Get Context for AI
        const history = await prisma.chatMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: "desc" },
            take: 10,
        });
        const context = history.reverse().map(m => ({ role: m.role, content: m.message }));

        // 4. Get AI Response
        let aiResponseText = await aiService.getChatResponse(message, context);
        if (!aiResponseText) aiResponseText = "Quantum Link Interference: Failed to generate clinical insight.";

        // 5. Save AI Message
        await prisma.chatMessage.create({
            data: {
                userId,
                conversationId,
                role: "assistant",
                message: aiResponseText
            },
        });

        res.json({
            chatId: conversationId,
            response: aiResponseText
        });

    } catch (error) {
        console.error("[Chat] CRITICAL ERROR:", error);
        res.status(500).json({ message: "System Link Failure: Transmission Terminated." });
    }
};

const clearChatHistory = async (req, res) => {
    try {
        // Delete all conversations (and messages via cascade if configured, or manually)
        // Here we'll delete messages first then conversations for safety
        await prisma.chatMessage.deleteMany({ where: { userId: req.userId } });
        await prisma.conversation.deleteMany({ where: { userId: req.userId } });

        res.json({ message: "Nexus data archives purged successfully." });
    } catch (error) {
        console.error("Clear chat history error:", error);
        res.status(500).json({ message: "Purge sequence failed." });
    }
};

module.exports = {
    getChatHistory,
    getConversationMessages,
    sendMessage,
    clearChatHistory,
};
