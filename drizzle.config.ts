import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./lib/onboarding/schema.ts", "./lib/meetings/schema.ts"],
  out: "./drizzle",
  schemaFilter: ["onboarding", "meetings"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
