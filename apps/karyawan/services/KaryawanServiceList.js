const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { KARYAWAN_CONFIG_MAIN_TABLE } = require("../config");

const KaryawanServiceList = async (terms, page) => {
    const queryBuilder = BaseServiceQueryBuilder(KARYAWAN_CONFIG_MAIN_TABLE);

    if (terms) {
        queryBuilder
            .whereILike("ID_Karyawan", `%${terms}%`)
            .orWhereILike("Nama_Karyawan", `%${terms}%`);
    }

    return {
        ...(await BaseServicePaginator(page, queryBuilder)),
        terms: terms ? terms : "",
    };
};

module.exports = KaryawanServiceList;
