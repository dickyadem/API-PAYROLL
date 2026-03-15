const BaseServiceQueryBuilder = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "payroll",
    },
    pool: {
        min: 2,
        max: 10,
    },
});
BaseServiceQueryBuilder.fetchAll = async function (table) {
    return this(table).select("*");
};
module.exports = BaseServiceQueryBuilder;
