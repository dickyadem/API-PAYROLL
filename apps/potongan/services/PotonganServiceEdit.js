const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceEdit = async (
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

  await BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE)
    .where({ ID_Potongan })
    .update(data);

  return { ID_Potongan, ...data };
};

module.exports = PotonganServiceEdit;
