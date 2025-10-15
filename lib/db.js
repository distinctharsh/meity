import mysql from "mysql2/promise";

// Reuse a single pool across hot reloads and API route executions
// to prevent exhausting MySQL connections in dev/SSR.
let cachedPool = globalThis.__MEITY_DB_POOL__;
if (!cachedPool) {
  cachedPool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "meity_clone",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  globalThis.__MEITY_DB_POOL__ = cachedPool;
}

export default cachedPool;