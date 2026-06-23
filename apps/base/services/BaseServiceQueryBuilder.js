const BaseServiceQueryBuilder = require("../db");
BaseServiceQueryBuilder.fetchAll = async function (table) {
    return this(table).select("*");
};
module.exports = BaseServiceQueryBuilder;
