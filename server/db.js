import "dotenv/config";
import mysql2 from "mysql2/promise";

export const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10,
});

db.getConnection()
  .then((connection) => {
    console.log("MySQL connected!");
    connection.release();
  })
  .catch((error) => {
    console.error("MySQL connection error:", error);
  });
