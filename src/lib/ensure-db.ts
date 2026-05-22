import mysql from "mysql2/promise";
import { ensureDatabaseUrl, getDatabaseUrl } from "./database-url";

const CREATE_BIENS_TABLE = `
CREATE TABLE IF NOT EXISTS \`Biens\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`nom\` VARCHAR(191) NOT NULL,
  \`type\` VARCHAR(100) NOT NULL,
  \`adresse\` VARCHAR(255) NULL,
  \`loyer\` INT NOT NULL DEFAULT 0,
  \`statut\` VARCHAR(50) NOT NULL DEFAULT 'Vacant',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const CREATE_LOCATAIRES_TABLE = `
CREATE TABLE IF NOT EXISTS \`Locataires\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`nom\` VARCHAR(191) NOT NULL,
  \`bien\` VARCHAR(191) NULL,
  \`loyer\` INT NOT NULL DEFAULT 0,
  \`statut\` VARCHAR(50) NOT NULL DEFAULT 'À jour',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

let biensTableEnsured = false;
let locatairesTableEnsured = false;

async function ensureTable(
  createSql: string,
  flag: { value: boolean },
  setFlag: (value: boolean) => void
) {
  if (flag.value) return;

  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL ou variables DB_* manquantes.");
  }

  if (url.startsWith("file:")) {
    setFlag(true);
    return;
  }

  const connection = await mysql.createConnection(url);
  try {
    await connection.query(createSql);
    setFlag(true);
  } finally {
    await connection.end();
  }
}

export async function ensureBiensTable() {
  await ensureTable(
    CREATE_BIENS_TABLE,
    { value: biensTableEnsured },
    (value) => {
      biensTableEnsured = value;
    }
  );
}

export async function ensureLocatairesTable() {
  await ensureTable(
    CREATE_LOCATAIRES_TABLE,
    { value: locatairesTableEnsured },
    (value) => {
      locatairesTableEnsured = value;
    }
  );
}

export function getDatabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("DATABASE_URL") || error.message.includes("DB_*")) {
      return "Base de données non configurée dans Hostinger (DATABASE_URL manquante).";
    }
    if (error.message.includes("Access denied")) {
      return "Identifiants MySQL incorrects dans DATABASE_URL.";
    }
    if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
      return "Connexion MySQL impossible. Utilisez localhost comme hôte sur Hostinger.";
    }
    if (error.message.includes("doesn't exist") || error.message.includes("n'existe pas")) {
      return "Une table est introuvable dans la base de données.";
    }
  }

  return "Impossible de se connecter à la base de données.";
}
