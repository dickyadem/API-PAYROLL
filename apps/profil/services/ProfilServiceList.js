const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PROFIL_CONFIG_MAIN_TABLE } = require("../config");

const ProfilServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(PROFIL_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Profil", `%${terms}%`)
            .orWhereILike("Nama", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = ProfilServiceList;
