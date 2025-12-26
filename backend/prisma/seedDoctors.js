const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const doctors = [
    {
        name: "Dr. Emily Carter",
        specialization: "Cardiologist",
        experience: 12,
        fees: 1500,
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Expert in interventional cardiology with over a decade of experience in treating complex heart conditions.",
        available: true,
        rating: 4.8,
    },
    {
        name: "Dr. James Wilson",
        specialization: "Dermatologist",
        experience: 8,
        fees: 1200,
        location: "Los Angeles, CA",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Specializing in cosmetic and medical dermatology, focused on patient-centered care.",
        available: true,
        rating: 4.7,
    },
    {
        name: "Dr. Sarah Johnson",
        specialization: "Neurologist",
        experience: 15,
        fees: 2000,
        location: "Chicago, IL",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Board-certified neurologist with a special interest in migraine management and neurodegenerative disorders.",
        available: true,
        rating: 4.9,
    },
    {
        name: "Dr. Michael Chen",
        specialization: "Pediatrician",
        experience: 10,
        fees: 1000,
        location: "Houston, TX",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Compassionate pediatrician dedicated to the health and well-being of children from infancy through adolescence.",
        available: true,
        rating: 4.8,
    },
    {
        name: "Dr. Linda Rodriguez",
        specialization: "General Physician",
        experience: 20,
        fees: 800,
        location: "Miami, FL",
        image: "https://images.unsplash.com/photo-1623854767661-53df3bed1faa?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Experienced primary care physician emphasizing preventive medicine and holistic health.",
        available: true,
        rating: 4.6,
    },
    {
        name: "Dr. David Smith",
        specialization: "Orthopedic",
        experience: 14,
        fees: 1800,
        location: "Seattle, WA",
        image: "https://images.unsplash.com/photo-1612349316988-db5b9f9b0c26?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Orthopedic surgeon specializing in sports medicine and joint replacement surgeries.",
        available: true,
        rating: 4.7,
    },
    {
        name: "Dr. Olivia Martinez",
        specialization: "Cardiologist",
        experience: 9,
        fees: 1400,
        location: "San Francisco, CA",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Dedicated cardiologist focused on preventive cardiology and heart failure management.",
        available: true,
        rating: 4.8,
    },
    {
        name: "Dr. Robert Brown",
        specialization: "Dermatologist",
        experience: 25,
        fees: 1600,
        location: "Boston, MA",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
        about: "Renowned dermatologist with expertise in skin cancer screening and treatment.",
        available: true,
        rating: 4.9,
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (const doctor of doctors) {
        const d = await prisma.doctor.create({
            data: doctor,
        });
        console.log(`Created doctor with id: ${d.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
