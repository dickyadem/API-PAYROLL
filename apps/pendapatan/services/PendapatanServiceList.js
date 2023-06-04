const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PENDAPATAN_CONFIG_MAIN_TABLE } = require("../config");

const PendapatanServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(PENDAPATAN_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Pendapatan", `%${terms}%`)
            .orWhereILike("Nama_Pendapatan", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = PendapatanServiceList;
