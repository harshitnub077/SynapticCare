const { prisma } = require("../utils/prismaClient");
const { z } = require("zod");

// Schema for creating/updating a doctor
const doctorSchema = z.object({
    name: z.string().min(3),
    specialization: z.string().min(3),
    experience: z.number().min(0),
    fees: z.number().min(0),
    location: z.string().min(3),
    image: z.string().optional(),
    about: z.string().optional(),
    available: z.boolean().optional(),
});

// Create a new doctor
const createDoctor = async (req, res) => {
    try {
        const parsed = doctorSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid input", error: parsed.error.errors });
        }

        const doctor = await prisma.doctor.create({
            data: parsed.data,
        });

        res.status(201).json({ message: "Doctor created successfully", doctor });
    } catch (error) {
        console.error("Create Doctor Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all doctors with search, filter, sort, and pagination
const getDoctors = async (req, res) => {
    try {
        const {
            search,
            specialization,
            location,
            minFees,
            maxFees,
            sortBy, // fees_asc, fees_desc, experience_desc, rating_desc
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        // Search by name or specialization
        if (search) {
            query.OR = [
                { name: { contains: search } }, // Case-insensitive in SQLite depends on collation, usually case-insensitive by default for LIKE
                { specialization: { contains: search } },
            ];
        }

        // Filters
        if (specialization) query.specialization = { contains: specialization };
        if (location) query.location = { contains: location };
        if (minFees || maxFees) {
            query.fees = {};
            if (minFees) query.fees.gte = parseFloat(minFees);
            if (maxFees) query.fees.lte = parseFloat(maxFees);
        }

        // Sorting
        let orderBy = { createdAt: "desc" }; // Default sort
        if (sortBy === "fees_asc") orderBy = { fees: "asc" };
        if (sortBy === "fees_desc") orderBy = { fees: "desc" };
        if (sortBy === "experience_desc") orderBy = { experience: "desc" };
        if (sortBy === "rating_desc") orderBy = { rating: "desc" };

        // Pagination
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
        const skip = (pageNum - 1) * limitNum;

        const [doctors, total] = await Promise.all([
            prisma.doctor.findMany({
                where: query,
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma.doctor.count({ where: query }),
        ]);

        res.json({
            doctors,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error("Get Doctors Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await prisma.doctor.findUnique({ where: { id } });

        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        res.json({ doctor });
    } catch (error) {
        console.error("Get Doctor Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update doctor
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const parsed = doctorSchema.partial().safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid input", error: parsed.error.errors });
        }

        const doctor = await prisma.doctor.update({
            where: { id },
            data: parsed.data,
        });

        res.json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error("Update Doctor Error:", error);
        if (error.code === "P2025") return res.status(404).json({ message: "Doctor not found" });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.doctor.delete({ where: { id } });
        res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Delete Doctor Error:", error);
        if (error.code === "P2025") return res.status(404).json({ message: "Doctor not found" });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
};
