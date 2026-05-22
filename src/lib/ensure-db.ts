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

let tableEnsured = false;

export async function ensureBiensTable() {
  if (tableEnsured) return;

  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL ou variables DB_* manquantes.");
  }

  const connection = await mysql.createConnection(url);
  try {
    await connection.query(CREATE_BIENS_TABLE);
    tableEnsured = true;
  } finally {
    await connection.end();
  }
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
      return "La table Biens est introuvable dans la base de données.";
    }
  }

  return "Impossible de se connecter à la base de données.";
}
