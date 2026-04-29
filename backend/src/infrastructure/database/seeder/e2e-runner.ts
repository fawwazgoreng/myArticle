import path from "path";
import prisma from "@infra/database/prisma/prisma";

const runDynamicSeeder = async () => {
    const fileName = process.argv[2];
    const fileLocation = process.argv[2].toLowerCase() + ".scenario.seeder.ts";
    if (!fileLocation) {
        console.error(
            "❌ Please provide a seeder file name. Example: bun db:seed:e2e auth",
        );
        process.exit(1);
    }
    
    try {
        const filePath = path.join(process.cwd(), "src/infrastructure/database/seeder/e2e", fileLocation);
        const SeederClass = await import(filePath);
        
        const key = Object.keys(SeederClass)[0];
        const instance = new SeederClass[key](prisma);
        await instance.run();
        console.log(`success seeding ${fileName}`)
    } catch (error) {
        console.log(`failed running ${fileLocation}`,error);
    } finally {
        prisma.$disconnect();
    }
};

runDynamicSeeder();