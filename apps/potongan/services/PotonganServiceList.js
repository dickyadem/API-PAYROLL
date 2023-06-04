const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Potongan", `%${terms}%`)
            .orWhereILike("Nama_Potongan", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = PotonganServiceList;
