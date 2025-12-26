const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "General Physician",
    "Orthopedic",
    "Psychiatrist",
    "Ophthalmologist",
    "Dentist",
    "ENT Specialist"
];

const locations = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"
];

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

const images = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1623854767661-53df3bed1faa?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300"
];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const doctors = [];

for (let i = 0; i < 50; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    doctors.push({
        name: `Dr. ${firstName} ${lastName}`,
        specialization: getRandomElement(specializations),
        experience: getRandomInt(2, 35),
        fees: getRandomInt(500, 3000), // Random fees between 500 and 3000
        location: getRandomElement(locations),
        image: getRandomElement(images),
        about: `Experienced specialist dedicated to providing top-quality patient care. Committed to ongoing education and the latest medical advancements.`,
        available: true,
        rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)), // Rating between 3.5 and 5.0
    });
}

async function main() {
    console.log(`Start seeding 50+ doctors ...`);

    // Optional: clear existing doctors if starting fresh, or append.
    // The user asked for "5 more pages", implying adding to existing.
    // But to be safe and clean, having a mix is fine.

    for (const doctor of doctors) {
        const d = await prisma.doctor.create({
            data: doctor,
        });
        // console.log(`Created doctor: ${d.name}`);
    }
    console.log(`Seeding finished. Added ${doctors.length} doctors.`);
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
