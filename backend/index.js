require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5050;


const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];
const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  console.warn(`WARNING: Missing required environment variable(s): ${missingVars.join(", ")}`);
  console.warn("Please create a .env file based on .env.example");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});