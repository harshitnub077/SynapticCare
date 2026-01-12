const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Signup routes (support both /signup and /register)
router.post("/signup", signup);
router.post("/register", signup);

// Login route
router.post("/login", login);

module.exports = router;
