const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function loadEnvFile(filename) {
  const filePath = path.join(__dirname, "..", filename);

  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("DATABASE_URL manquante.");
    process.exit(1);
  }

  const host = url.match(/@([^:/]+)/)?.[1] ?? "?";
  console.log(`Connexion à ${host}...`);

  let connection;

  try {
    connection = await mysql.createConnection(url);
    const [rows] = await connection.query("SELECT COUNT(*) AS n FROM Biens");
    console.log(`OK — table Biens accessible (${rows[0].n} enregistrement(s)).`);
  } catch (error) {
    console.error("Échec:", error.message);

    if (error.message.includes("Access denied")) {
      console.error(`
→ Hostinger bloque l'accès distant. Dans hPanel :
  1. Bases de données → MySQL distant (Remote MySQL)
  2. Ajoutez votre IP publique (IPv4 et/ou IPv6)
  3. Hôte à utiliser sur Mac : auth-db515.hstgr.io
  4. Sur le serveur Node.js Hostinger : localhost
`);
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
