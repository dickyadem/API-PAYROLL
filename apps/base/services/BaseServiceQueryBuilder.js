const BaseServiceQueryBuilder = require("knex")({
    client: "mysql",
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "payroll",
    },
});
BaseServiceQueryBuilder.fetchAll = async function (table) {
    return this(table).select("*");
};
module.exports = BaseServiceQueryBuilder;
