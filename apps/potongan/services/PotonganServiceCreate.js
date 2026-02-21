const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceCreate = async (
    ID_Potongan,
    Nama_Potongan,
    Nominal,
    ID_Jabatan,
    Keterangan
) => {
    const data = {
        ID_Potongan,
        Nama_Potongan,
        Nominal,
        ID_Jabatan: ID_Jabatan || null,
        Keterangan: Keterangan || null
    };

    await BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = PotonganServiceCreate;
