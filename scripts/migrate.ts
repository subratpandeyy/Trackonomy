import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

const main = async () => {
    try {
        console.log("🚀 Starting database migrations...");
        
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not set in .env.local");
        }
        
        console.log("📡 Connecting to database...");
        const sql = neon(process.env.DATABASE_URL!);
        const db = drizzle(sql);

        console.log("🔄 Running migrations from folder: drizzle");
        await migrate(db, { migrationsFolder: "drizzle" });
        
        console.log("✅ Migrations completed successfully!");
        
    } catch (error) {
        console.error("❌ Error during migration:", error);
        process.exit(1);
    }
};

main();