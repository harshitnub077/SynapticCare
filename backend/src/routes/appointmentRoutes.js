const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

// All appointment routes require authentication
router.use(authMiddleware);

router.post("/", bookAppointment);
router.get("/", getMyAppointments);
router.put("/:id/cancel", cancelAppointment);

module.exports = router;
