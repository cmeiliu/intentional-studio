import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  const migration = fs.readFileSync(
    path.join(process.cwd(), "drizzle/0000_onboarding_meetings.sql"),
    "utf8",
  );
  const statements = migration
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  await sql.transaction((tx) => statements.map((statement) => tx.query(statement)));
  console.log("onboarding + meetings schemas are present");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
