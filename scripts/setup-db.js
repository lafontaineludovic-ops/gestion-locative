const mysql = require("mysql2/promise");

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

async function main() {
  const config = getConnectionConfig();

  if (!config) {
    console.warn("[setup-db] DATABASE_URL ou DB_* non définies — création ignorée.");
    process.exit(0);
  }

  let connection;

  try {
    console.log("[setup-db] Connexion MySQL...");
    connection = await mysql.createConnection(config);

    console.log("[setup-db] Création de la table Biens...");
    await connection.query(CREATE_BIENS_TABLE);

    const [rows] = await connection.query("SHOW TABLES LIKE 'Biens'");
    if (rows.length === 0) {
      throw new Error("La table Biens n'a pas pu être créée.");
    }

    console.log("[setup-db] Table Biens prête.");
  } catch (error) {
    console.error("[setup-db] Échec:", error.message);
    process.exit(0);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
