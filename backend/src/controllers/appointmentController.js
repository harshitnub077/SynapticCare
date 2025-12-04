const { prisma } = require("../utils/prismaClient");
const { z } = require("zod");

// Schema for booking an appointment
const appointmentSchema = z.object({
    doctorId: z.string(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    time: z.string(),
    reason: z.string().optional(),
});

// Book an appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const parsed = appointmentSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid input", error: parsed.error.errors });
        }

        const { doctorId, date, time, reason } = parsed.data;

        // Check if doctor exists
        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // Check availability (simplified: just check if slot is taken)
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId,
                date: new Date(date),
                time,
                status: { not: "cancelled" },
            },
        });

        if (existingAppointment) {
            return res.status(409).json({ message: "Time slot already booked" });
        }

        const appointment = await prisma.appointment.create({
            data: {
                userId,
                doctorId,
                date: new Date(date),
                time,
                reason,
                status: "booked",
            },
            include: {
                doctor: true,
            },
        });

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error("Book Appointment Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user's appointments
const getMyAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await prisma.appointment.findMany({
            where: { userId },
            include: {
                doctor: true,
            },
            orderBy: { date: "desc" },
        });

        res.json({ appointments });
    } catch (error) {
        console.error("Get Appointments Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const appointment = await prisma.appointment.findUnique({ where: { id } });

        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        if (appointment.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: { status: "cancelled" },
        });

        res.json({ message: "Appointment cancelled successfully", appointment: updatedAppointment });
    } catch (error) {
        console.error("Cancel Appointment Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
};
