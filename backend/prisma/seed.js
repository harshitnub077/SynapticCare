const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding doctors...");

    const doctors = [
        {
            name: "Dr. Sarah Johnson",
            specialization: "Cardiologist",
            experience: 15,
            fees: 150,
            location: "New York, NY",
            rating: 4.9,
            about: "Expert in cardiovascular health with over 15 years of experience.",
            available: true,
        },
        {
            name: "Dr. Michael Chen",
            specialization: "Dermatologist",
            experience: 8,
            fees: 120,
            location: "San Francisco, CA",
            rating: 4.7,
            about: "Specializing in skin care, acne treatment, and cosmetic dermatology.",
            available: true,
        },
        {
            name: "Dr. Emily Davis",
            specialization: "Pediatrician",
            experience: 12,
            fees: 100,
            location: "Chicago, IL",
            rating: 4.8,
            about: "Compassionate care for children from infancy through adolescence.",
            available: true,
        },
        {
            name: "Dr. James Wilson",
            specialization: "Neurologist",
            experience: 20,
            fees: 200,
            location: "Boston, MA",
            rating: 5.0,
            about: "Specialist in disorders of the nervous system, brain, and spinal cord.",
            available: false,
        },
        {
            name: "Dr. Linda Martinez",
            specialization: "General Physician",
            experience: 5,
            fees: 80,
            location: "Miami, FL",
            rating: 4.5,
            about: "Providing comprehensive primary care for adults and seniors.",
            available: true,
        },
        {
            name: "Dr. Robert Taylor",
            specialization: "Orthopedic",
            experience: 18,
            fees: 180,
            location: "Houston, TX",
            rating: 4.6,
            about: "Expert in bone, joint, and muscle health.",
            available: true,
        },
        {
            name: "Dr. William Brown",
            specialization: "Cardiologist",
            experience: 22,
            fees: 250,
            location: "Los Angeles, CA",
            rating: 4.9,
            about: "Renowned cardiologist specializing in complex heart surgeries.",
            available: true,
        },
        {
            name: "Dr. Elizabeth White",
            specialization: "Dermatologist",
            experience: 10,
            fees: 140,
            location: "Seattle, WA",
            rating: 4.8,
            about: "Expert in laser treatments and cosmetic procedures.",
            available: true,
        },
        {
            name: "Dr. David Miller",
            specialization: "Pediatrician",
            experience: 7,
            fees: 90,
            location: "Austin, TX",
            rating: 4.6,
            about: "Friendly and patient-focused pediatrician.",
            available: true,
        },
        {
            name: "Dr. Jennifer Garcia",
            specialization: "Neurologist",
            experience: 14,
            fees: 190,
            location: "Denver, CO",
            rating: 4.7,
            about: "Specializing in migraine and headache management.",
            available: true,
        },
        {
            name: "Dr. Charles Anderson",
            specialization: "General Physician",
            experience: 30,
            fees: 100,
            location: "Phoenix, AZ",
            rating: 4.5,
            about: "Decades of experience in family medicine.",
            available: true,
        },
        {
            name: "Dr. Patricia Thomas",
            specialization: "Orthopedic",
            experience: 11,
            fees: 160,
            location: "San Diego, CA",
            rating: 4.8,
            about: "Sports medicine and injury rehabilitation specialist.",
            available: true,
        },
        {
            name: "Dr. Christopher Lee",
            specialization: "Cardiologist",
            experience: 9,
            fees: 130,
            location: "Atlanta, GA",
            rating: 4.6,
            about: "Preventive cardiology and lifestyle management.",
            available: true,
        },
        {
            name: "Dr. Margaret Walker",
            specialization: "Dermatologist",
            experience: 16,
            fees: 150,
            location: "Portland, OR",
            rating: 4.9,
            about: "Specialist in skin cancer detection and treatment.",
            available: true,
        },
        {
            name: "Dr. Daniel Hall",
            specialization: "Pediatrician",
            experience: 4,
            fees: 85,
            location: "Nashville, TN",
            rating: 4.4,
            about: "Dedicated to newborn and infant care.",
            available: true,
        },
        {
            name: "Dr. Nancy Allen",
            specialization: "Neurologist",
            experience: 25,
            fees: 220,
            location: "Philadelphia, PA",
            rating: 5.0,
            about: "Expert in neurodegenerative diseases like Alzheimer's.",
            available: false,
        },
        {
            name: "Dr. Paul Young",
            specialization: "General Physician",
            experience: 13,
            fees: 95,
            location: "Dallas, TX",
            rating: 4.7,
            about: "Holistic approach to general health and wellness.",
            available: true,
        },
        {
            name: "Dr. Karen King",
            specialization: "Orthopedic",
            experience: 21,
            fees: 200,
            location: "Detroit, MI",
            rating: 4.9,
            about: "Joint replacement surgery specialist.",
            available: true,
        },
        {
            name: "Dr. Steven Wright",
            specialization: "Cardiologist",
            experience: 19,
            fees: 180,
            location: "Las Vegas, NV",
            rating: 4.8,
            about: "Interventional cardiology expert.",
            available: true,
        },
        {
            name: "Dr. Sandra Scott",
            specialization: "Dermatologist",
            experience: 6,
            fees: 110,
            location: "Orlando, FL",
            rating: 4.5,
            about: "Treatment of eczema, psoriasis, and other skin conditions.",
            available: true,
        },
    ];

    for (const doctor of doctors) {
        await prisma.doctor.create({
            data: doctor,
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
