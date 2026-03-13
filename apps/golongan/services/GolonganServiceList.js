const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GOLONGAN_CONFIG_MAIN_TABLE } = require("../config");

const GolonganServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(GOLONGAN_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Golongan", `%${terms}%`)
            .orWhereILike("Nama_Golongan", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = GolonganServiceList;
