function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT || "3306";

  if (!host || !user || !password || !database) {
    return null;
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  return `mysql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;
}

export function getDatabaseUrl() {
  const url = buildDatabaseUrl();

  if (!url && !process.env.DATABASE_URL) {
    return null;
  }

  return url ?? process.env.DATABASE_URL ?? null;
}

export function ensureDatabaseUrl() {
  const url = getDatabaseUrl();

  if (!url) {
    throw new Error(
      "DATABASE_URL ou variables DB_HOST, DB_USER, DB_PASSWORD, DB_NAME manquantes."
    );
  }

  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = url;
  }

  return url;
}
