require("dotenv").config();

const connection = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "payroll",
};

if (process.env.DB_SSL === "true") {
    connection.ssl = { rejectUnauthorized: false };
}

module.exports = {
    client: "mysql",
    connection,
    migrations: {
        directory: "./migrations",
        tableName: "knex_migrations",
    },
    seeds: {
        directory: "./seeds",
    },
};
