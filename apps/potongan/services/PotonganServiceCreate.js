const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceCreate = async (
    ID_Potongan,
    Nama_Potongan
) => {
    const data = {
        ID_Potongan,
        Nama_Potongan
    };

    await BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = PotonganServiceCreate;
