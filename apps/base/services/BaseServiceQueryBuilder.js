const BaseServiceQueryBuilder = require("../db");
BaseServiceQueryBuilder.fetchAll = async function (table) {
    return this(table).select("*");
};
BaseServiceQueryBuilder.fetchFirst = async function (table) {
    return this(table).select("*").first();
};
module.exports = BaseServiceQueryBuilder;
