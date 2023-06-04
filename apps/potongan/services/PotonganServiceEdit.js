const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceEdit = async (
    ID_Potongan,
    Nama_Potongan
) => {
  const data = {
    ID_Potongan,
    Nama_Potongan
  };

  await BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE)
    .where({ ID_Potongan })
    .update(data);

  return { ID_Potongan, ...data };
};

module.exports = PotonganServiceEdit;
