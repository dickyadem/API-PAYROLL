const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PENDAPATANDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const PendapatanDetailServiceCreate = async (
    ID_Gaji,
    ID_Pendapatan,
    Jumlah_Pendapatn

) => {
    const data = {
        ID_Gaji,
        ID_Pendapatan,
        Jumlah_Pendapatn
    
        
    };

    await BaseServiceQueryBuilder(PENDAPATANDETAIL_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = PendapatanDetailServiceCreate;
