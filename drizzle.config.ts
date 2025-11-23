import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
    schema: "./db/schema.ts",
    dialect: "postgresql", // Changed from 'driver' to 'dialect'
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Changed from 'connectionString' to 'url'
    },
    out: "./drizzle", // Add this line to specify output directory
    verbose: true,
    strict: true,
});