const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { JABATAN_CONFIG_MAIN_TABLE } = require("../config");

const JabatanServiceCreate = async (
    ID_Jabatan,
    Nama_Jabatan,

) => {
    const data = {
        ID_Jabatan,
        Nama_Jabatan,
        
    };

    await BaseServiceQueryBuilder(JABATAN_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = JabatanServiceCreate;
