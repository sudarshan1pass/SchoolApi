const mysql = require("mysql2");

function getDatabaseConfig() {
  const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

  if (connectionUrl) {
    return connectionUrl;
  }

  return {
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || "school_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const db = mysql.createPool(getDatabaseConfig());

function connectDB() {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.release();
      resolve();
    });
  });
}

module.exports = { db, connectDB };
