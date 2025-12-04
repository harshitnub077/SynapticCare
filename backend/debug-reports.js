// Debug script to check report data structure
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReports() {
    try {
        const reports = await prisma.report.findMany({
            orderBy: { uploadedAt: 'desc' },
            take: 3,
        });

        console.log('\n========== RECENT REPORTS ==========');
        for (const report of reports) {
            console.log(`\nReport ID: ${report.id}`);
            console.log(`Filename: ${report.filename}`);
            console.log(`Status: ${report.status}`);
            console.log(`Extracted Text Length: ${report.extractedText?.length || 0}`);
            console.log(`Parsed Data Items: ${report.parsedData?.length || 0}`);
            console.log(`Flags Type: ${typeof report.flags}`);
            console.log(`Flags Content:`, JSON.stringify(report.flags, null, 2));

            if (report.flags) {
                console.log(`  - abnormalities: ${report.flags.abnormalities?.length || 0} items`);
                console.log(`  - aiInsights exists: ${!!report.flags.aiInsights}`);
                if (report.flags.aiInsights) {
                    console.log(`  - aiInsights.summary length: ${report.flags.aiInsights.summary?.length || 0}`);
                    console.log(`  - aiInsights.urgency: ${report.flags.aiInsights.urgency}`);
                }
            }
        }
        console.log('\n========== END ==========\n');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkReports();
