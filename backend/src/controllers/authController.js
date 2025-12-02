const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { prisma } = require("../utils/prismaClient");

const signup = async (req, res) => {
    const schema = z.object({
        email: z.string().email(),
        password: z
            .string()
            .min(8)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/),
        name: z.string().min(3).max(30),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid input", error: parsed.error.errors });

    const { email, password, name } = parsed.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(409).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        // Generate token for immediate login
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });

        res.status(201).json({ message: "Signup successful", token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });

        res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { signup, login };
