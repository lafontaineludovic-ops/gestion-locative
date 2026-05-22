import mysql from "mysql2/promise";

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

function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !password || !database) {
    return null;
  }

  return {
    host,
    port: Number(process.env.DB_PORT || 3306),
    user,
    password,
    database,
  };
}

export async function ensureBiensTable() {
  if (tableEnsured) return;

  const config = getConnectionConfig();
  if (!config) {
    throw new Error("DATABASE_URL ou variables DB_* manquantes.");
  }

  let connection;
  if (typeof config === "string") {
    connection = await mysql.createConnection(config);
  } else {
    connection = await mysql.createConnection(config);
  }
  try {
    await connection.query(CREATE_BIENS_TABLE);
    tableEnsured = true;
  } finally {
    await connection.end();
  }
}

export function getDatabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("DATABASE_URL")) {
      return "Base de données non configurée. Ajoutez DATABASE_URL dans Hostinger.";
    }
    if (error.message.includes("Access denied")) {
      return "Identifiants MySQL incorrects. Vérifiez DATABASE_URL dans Hostinger.";
    }
    if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
      return "Connexion MySQL impossible. Utilisez localhost comme hôte sur Hostinger.";
    }
    if (error.message.includes("doesn't exist") || error.message.includes("n'existe pas")) {
      return "La table Biens est introuvable. Redéployez l'application ou exécutez le script SQL.";
    }
  }

  return "Impossible de se connecter à la base de données.";
}
