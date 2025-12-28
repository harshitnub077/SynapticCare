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
        const userId = req.userId;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }
        if (!userId) {
            console.error("[Chat] Request missing userId.");
            return res.status(401).json({ message: "User not authenticated" });
        }

        console.log(`[Chat] Processing message for user ${userId}: "${message.substring(0, 20)}..."`);

        // 1. Safe Save User Message (Do not block if fails)
        let userMessage = { role: "user", message, createdAt: new Date() };
        try {
            userMessage = await prisma.chatMessage.create({
                data: { userId, role: "user", message },
            });
        } catch (dbError) {
            console.error("[Chat] Failed to save user message to DB (continuing anyway):", dbError.message);
        }

        // 2. Fetch History (Safe)
        let context = [];
        try {
            const history = await prisma.chatMessage.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 10,
            });
            context = history.reverse().map(m => ({ role: m.role, content: m.message }));
        } catch (histError) {
            console.warn("[Chat] Failed to fetch history (starting fresh context):", histError.message);
        }

        // 3. Get AI Response
        console.log(`[Chat] Calling AI Service...`);
        let aiResponseText;
        try {
            aiResponseText = await aiService.getChatResponse(message, context);
            if (!aiResponseText || typeof aiResponseText !== 'string') {
                throw new Error("AI Service returned empty or invalid response");
            }
        } catch (aiError) {
            console.error("[Chat] AI Service Fatal Error:", aiError);
            aiResponseText = "I am currently experiencing a connection issue. Please try again in a moment.";
        }

        // 4. Safe Save AI Response (Do not block if fails)
        let aiMessage = { role: "assistant", message: aiResponseText, createdAt: new Date() };
        try {
            aiMessage = await prisma.chatMessage.create({
                data: { userId, role: "assistant", message: aiResponseText },
            });
        } catch (dbError) {
            console.error("[Chat] Failed to save AI response to DB (continuing anyway):", dbError.message);
        }

        console.log(`[Chat] Success. Sending response.`);

        // Always return 200 OK so frontend receives the message
        res.json({
            userMessage,
            aiMessage
        });

    } catch (criticalError) {
        console.error("[Chat] CRITICAL UNHANDLED ERROR:", criticalError);
        // Even in critical failure, try to return a valid JSON to prevent frontend generic error
        res.status(200).json({
            userMessage: { role: "user", message: req.body.message || "" },
            aiMessage: { role: "assistant", message: "System Critical Error: " + criticalError.message }
        });
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
