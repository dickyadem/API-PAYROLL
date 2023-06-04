const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PENDAPATAN_CONFIG_MAIN_TABLE } = require("../config");

const PendapatanServiceEdit = async (
    ID_Pendapatan,
    Nama_Pendapatan
) => {
  const data = {
    ID_Pendapatan,
    Nama_Pendapatan
  };

  await BaseServiceQueryBuilder(PENDAPATAN_CONFIG_MAIN_TABLE)
    .where({ ID_Pendapatan })
    .update(data);

  return { ID_Pendapatan, ...data };
};

module.exports = PendapatanServiceEdit;
