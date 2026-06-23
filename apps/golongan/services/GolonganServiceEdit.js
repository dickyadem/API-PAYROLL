const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GOLONGAN_CONFIG_MAIN_TABLE } = require("../config");

const GolonganServiceEdit = async (
    ID_Golongan,
    Nama_Golongan,

) => {
  const data = {
    ID_Golongan,
    Nama_Golongan,

  };

  await BaseServiceQueryBuilder(GOLONGAN_CONFIG_MAIN_TABLE)
    .where({ ID_Golongan })
    .update(data);

  return { ID_Golongan, ...data };
};

module.exports = GolonganServiceEdit;
