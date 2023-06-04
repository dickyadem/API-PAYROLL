const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { JABATAN_CONFIG_MAIN_TABLE } = require("../config");

const JabatanServiceCreate = async (
    ID_Jabatan,
    Nama_Jabatan,
    Tunjangan_Jabatan,
    Tunjangan_Keluarga
) => {
    const data = {
        ID_Jabatan,
        Nama_Jabatan,
        Tunjangan_Jabatan,
        Tunjangan_Keluarga
    };

    await BaseServiceQueryBuilder(JABATAN_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = JabatanServiceCreate;
