const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to database');
        const users = await prisma.user.findMany();
        console.log('Users:', users);
    } catch (e) {
        console.error('Connection error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
