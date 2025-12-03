const { prisma } = require("../utils/prismaClient");
const aiService = require("../services/aiService");

const sendMessage = async (req, res) => {
    try {
        const { message, reportId } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Save user message
        await prisma.chatMessage.create({
            data: {
                userId: req.userId,
                role: "user",
                message: message,
                context: reportId ? { reportId } : null,
            },
        });

        // Get report context if provided
        let reportContext = null;
        if (reportId) {
            const report = await prisma.report.findFirst({
                where: {
                    id: reportId,
                    userId: req.userId,
                },
            });
            if (report) {
                reportContext = {
                    parsedData: report.parsedData,
                    flags: report.flags,
                };
            }
        }

        // Get AI response
        const aiResponse = await aiService.chat(message, reportContext);

        // Save AI response
        await prisma.chatMessage.create({
            data: {
                userId: req.userId,
                role: "assistant",
                message: aiResponse,
                context: reportId ? { reportId } : null,
            },
        });

        res.json({
            message: aiResponse,
        });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ message: "Failed to process chat message" });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const messages = await prisma.chatMessage.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "asc" },
            take: parseInt(limit),
        });

        res.json({ messages });
    } catch (error) {
        console.error("Get chat history error:", error);
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
};

/**
 * Clear all chat history for the current user.
 * This allows the user to start a fresh conversation while
 * keeping previous messages removed from the active history.
 */
const clearChatHistory = async (req, res) => {
    try {
        await prisma.chatMessage.deleteMany({
            where: { userId: req.userId },
        });

        return res.json({ message: "Chat history cleared" });
    } catch (error) {
        console.error("Clear chat history error:", error);
        return res.status(500).json({ message: "Failed to clear chat history" });
    }
};

module.exports = {
    sendMessage,
    getChatHistory,
    clearChatHistory,
};
