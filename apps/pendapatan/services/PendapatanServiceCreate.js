const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PENDAPATAN_CONFIG_MAIN_TABLE } = require("../config");

const PendapatanServiceCreate = async (
    ID_Pendapatan,
    Nama_Pendapatan,
    Nominal,
    ID_Jabatan,
    Keterangan,
    Jenis
) => {
    const data = {
        ID_Pendapatan,
        Nama_Pendapatan,
        Nominal,
        ID_Jabatan: ID_Jabatan || null,
        Keterangan: Keterangan || null,
        Jenis: Jenis || 'Tetap'
    };

    await BaseServiceQueryBuilder(PENDAPATAN_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = PendapatanServiceCreate;
