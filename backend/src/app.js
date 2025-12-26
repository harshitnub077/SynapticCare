const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// CORS Setup
const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((o) => o.trim());
// Ensure localhost is always allowed in dev
if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push("http://localhost:5173");
}

app.use(
    cors({
        origin: true, // Allow all origins for dev
        credentials: true,
    })
);

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes are mounted in index.js
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/reports", reportRoutes);
// app.use("/api/v1/assistant", assistantRoutes);
// app.use("/api/v1/doctors", doctorRoutes);
// app.use("/api/v1/appointments", appointmentRoutes);

app.get("/", (req, res) => {
    res.send("SynapticCare+ Backend is running 🚀");
});

module.exports = app;
