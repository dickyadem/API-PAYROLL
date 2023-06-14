const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJIDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const gajidetailServiceCreate = async (
    ID_gajidetail,
    ID_Pendapatan,
    Jumlah_Pendapatn,
    ID_Potongan,
    Jumlah_Potongan

) => {
    const data = {
        ID_gajidetail,
        ID_Pendapatan,
        Jumlah_Pendapatn,
        ID_Potongan,
        Jumlah_Potongan
    
        
    };

    await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = gajidetailServiceCreate;
