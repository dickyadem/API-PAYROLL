const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJIDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const GolonganServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Gaji", `%${terms}%`)
            .orWhereILike("ID_Pendapatan", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = GolonganServiceList;
