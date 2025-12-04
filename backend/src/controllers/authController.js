const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { prisma } = require("../utils/prismaClient");

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation (can be enhanced with Zod if needed)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        // Add more password complexity checks if desired

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "patient", // Default role to 'patient' if not provided
            },
        });

        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        console.error("Signup Error:", error); // Keep console.error for debugging
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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });

        res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { signup, login };
