import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  const rows = await sql`
    select table_schema, table_name
    from information_schema.tables
    where table_schema in ('onboarding', 'meetings')
    order by table_schema, table_name
  `;
  console.table(rows);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
