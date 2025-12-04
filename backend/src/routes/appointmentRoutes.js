const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

// All appointment routes require authentication
router.post("/", authMiddleware, appointmentController.bookAppointment);
router.get("/", authMiddleware, appointmentController.getMyAppointments);
router.get("/doctor", authMiddleware, appointmentController.getDoctorAppointments); // New route
router.put("/status/:id", authMiddleware, appointmentController.updateAppointmentStatus); // New route
router.delete("/:id", authMiddleware, appointmentController.cancelAppointment);

module.exports = router;
