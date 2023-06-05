const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJIDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const GajiDetailServiceCreate = async (
    ID_Gaji,
    ID_Pendapatan,
    Jumlah_Pendapatan,
    ID_Potongan,
    Jumlah_Potongan
) => {
    const data = {
        ID_Gaji,
        ID_Pendapatan,
        Jumlah_Pendapatan,
        ID_Potongan,
        Jumlah_Potongan
    };

    await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = GajiDetailServiceCreate;
