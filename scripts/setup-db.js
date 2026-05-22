const { execSync } = require("child_process");

const url = process.env.DATABASE_URL;

if (!url) {
  console.warn("[setup-db] DATABASE_URL non définie — création de table ignorée.");
  process.exit(0);
}

try {
  console.log("[setup-db] Synchronisation du schéma Prisma avec la base MySQL...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
  console.log("[setup-db] Table Biens prête.");
} catch (error) {
  console.error("[setup-db] Échec de la synchronisation:", error.message);
  process.exit(1);
}
