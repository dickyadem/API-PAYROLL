const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../config");

const UserServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("email", `%${terms}%`)
            .orWhereILike("NamaLengkap", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = UserServiceList;
