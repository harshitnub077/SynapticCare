const express = require("express");
const router = express.Router();
const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// Protected routes (Only admin should ideally do this, but for now any auth user can)
router.post("/", authMiddleware, createDoctor);
router.put("/:id", authMiddleware, updateDoctor);
router.delete("/:id", authMiddleware, deleteDoctor);

module.exports = router;
