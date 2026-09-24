import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// A pool, not a single connection — each request borrows a connection
// and returns it, so BizFlow can serve many shop owners at once.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
}
