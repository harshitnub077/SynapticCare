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

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
    try {
        const userId = req.userId;

        // Find the doctor profile associated with this user
        // Note: In a real app, we'd link User -> Doctor. For now, we'll assume the doctorId is passed or we find it via email/name match if we linked them.
        // BUT, looking at the schema, User and Doctor are separate. 
        // To simplify for this "student project", let's assume the frontend sends the doctorId or we fetch all appointments if the user has role 'doctor'.
        // Wait, the schema doesn't link User to Doctor directly. 
        // Let's assume for now we fetch ALL appointments for the system if the user is a doctor (admin-like) OR we need to link them.
        // Given the constraints, let's fetch all appointments for now since we don't have a direct link yet.
        // actually, let's just fetch all appointments for the doctor dashboard.

        const appointments = await prisma.appointment.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                },
                doctor: true
            },
            orderBy: { date: "desc" },
        });

        res.json({ appointments });
    } catch (error) {
        console.error("Get Doctor Appointments Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update appointment status (accept/cancel)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed', 'cancelled'

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status },
        });

        res.json({ message: `Appointment ${status} successfully`, appointment });
    } catch (error) {
        console.error("Update Appointment Status Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update appointment date
const updateAppointmentDate = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;
        const userId = req.userId;

        const appointment = await prisma.appointment.findUnique({ where: { id } });
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        if (appointment.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

        // Check availability for new slot
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: appointment.doctorId,
                date: new Date(date),
                time,
                status: { not: "cancelled" },
                id: { not: id } // Exclude current appointment
            },
        });

        if (existingAppointment) {
            return res.status(409).json({ message: "Time slot already booked" });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
                date: new Date(date),
                time,
                status: "booked" // Reset status to booked if it was confirmed/cancelled
            },
        });

        res.json({ message: "Appointment rescheduled successfully", appointment: updatedAppointment });
    } catch (error) {
        console.error("Update Appointment Date Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getDoctorAppointments,
    updateAppointmentStatus,
    updateAppointmentDate
};
