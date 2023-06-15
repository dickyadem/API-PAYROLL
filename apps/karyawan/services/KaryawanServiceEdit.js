const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { KARYAWAN_CONFIG_MAIN_TABLE } = require("../config");

const KaryawanServiceEdit = async (
    ID_Karyawan,
    Nama_Karyawan,
    ID_Golongan,
    ID_Jabatan,
    Divisi,
    Status_Pernikahan,
    Jumlah_Anak
) => {
  const data = {
    ID_Karyawan,
    Nama_Karyawan,
    ID_Golongan,
    ID_Jabatan,
    Divisi,
    Status_Pernikahan,
    Jumlah_Anak
  };

  await BaseServiceQueryBuilder(KARYAWAN_CONFIG_MAIN_TABLE)
    .where({ ID_Karyawan })
    .update(data);

  return { ID_Karyawan, ...data };
};

module.exports = KaryawanServiceEdit;
