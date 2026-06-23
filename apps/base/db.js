require("dotenv").config();
const knex = require("knex");

const connection = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "payroll",
};

if (process.env.DB_SSL === "true") {
    const ssl = { rejectUnauthorized: true };
    if (process.env.DB_CA_CERT) {
        ssl.ca = Buffer.from(process.env.DB_CA_CERT, "base64").toString("utf-8");
    }
    connection.ssl = ssl;
}

module.exports = knex({ client: "mysql2", connection });
