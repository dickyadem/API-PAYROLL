const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { JABATAN_CONFIG_MAIN_TABLE } = require("../config");

const JabatanServiceEdit = async (
  ID_Jabatan,
  Nama_Jabatan,
  Tunjangan_Jabatan,
  Tunjangan_Jabatan,
  Tunjangan_Keluarga
) => {
  const data = {
    ID_Jabatan,
    Nama_Jabatan,
    Tunjangan_Jabatan,
    Tunjangan_Jabatan,
    Tunjangan_Keluarga
  };

  await BaseServiceQueryBuilder(JABATAN_CONFIG_MAIN_TABLE)
    .where({ ID_Jabatan })
    .update(data);

  return { ID_Jabatan, ...data };
};

module.exports = JabatanServiceEdit;
