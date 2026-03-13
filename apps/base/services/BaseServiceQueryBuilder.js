const BaseServiceQueryBuilder = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "payroll",
    },
});

module.exports = BaseServiceQueryBuilder;
