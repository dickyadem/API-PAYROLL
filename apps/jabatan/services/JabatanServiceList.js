const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { JABATAN_CONFIG_MAIN_TABLE } = require("../config");

const JabatanServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(JABATAN_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Jabatan", `%${terms}%`)
            .orWhereILike("Nama_Jabatan", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = JabatanServiceList;
