const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { potongandetail_CONFIG_MAIN_TABLE } = require("../config");

const PotonganDetailServiceCreate = async (
    ID_potongandetail,
    ID_Potongan,
    Jumlah_Potongan

) => {
    const data = {
        ID_potongandetail,
        ID_Potongan,
        Jumlah_Potongan
    
        
    };

    await BaseServiceQueryBuilder(POTONGANDETAIL_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = PotonganDetailServiceCreate;
