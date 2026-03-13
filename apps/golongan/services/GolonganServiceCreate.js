const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GOLONGAN_CONFIG_MAIN_TABLE } = require("../config");

const GolonganServiceCreate = async (
    ID_Golongan,
    Nama_Golongan,
    Tunjangan_Golongan
) => {
    const data = {
        ID_Golongan,
        Nama_Golongan,
        Tunjangan_Golongan
    };

    await BaseServiceQueryBuilder(GOLONGAN_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = GolonganServiceCreate;
