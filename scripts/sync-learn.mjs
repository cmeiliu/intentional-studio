// Copies the self-paced course workspace into public/ so the lessons are
// served as static files for previewing on the site (and on deploy).
// The directory structure is mirrored exactly so the lessons' relative
// links (prev/next, ../../reference/glossary.html, ../../RESOURCES.md) keep working.
//
// Run with: npm run sync:learn
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "ai-automation-for-entrepreneurs");
const dest = join(root, "public", "learn");

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

// Mirror the workspace root so relative paths inside lessons resolve identically.
for (const item of ["lessons", "reference", "RESOURCES.md"]) {
  cpSync(join(src, item), join(dest, item), { recursive: true });
}

console.log("Synced course lessons → public/learn");
