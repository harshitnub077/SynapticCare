require("dotenv").config();
const app = require("./src/app");

const authRoutes = require("./src/routes/authRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const testRoutes = require("./src/routes/testRoutes");

const PORT = process.env.PORT || 5050;

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/test", testRoutes);

const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];
const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  console.warn(`WARNING: Missing required environment variable(s): ${missingVars.join(", ")} `);
  console.warn("Please create a .env file based on .env.example");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});