require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { prisma } = require("./prisma");

const app = express();
app.use(express.json());


console.log("Loaded ENV:");
console.log("CLIENT_ORIGIN:", process.env.CLIENT_ORIGIN);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);


const allowedOrigins = process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim());
console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use((req, res, next) => {
  console.log("🛰 Origin:", req.headers.origin);
  next();
});


const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET", "CLIENT_ORIGIN"];
const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missingVars.join(", ")}`);
}

const privateKey = process.env.JWT_SECRET;



app.get("/", (req, res) => {
  res.send("Backend server is alive 🚀");
});

// SIGNUP
app.post("/signup", async (req, res) => {
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
    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ---------------- Start Server -----------------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
