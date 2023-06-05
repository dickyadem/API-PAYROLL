const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJIDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const GajiDetailServiceEdit = async (
   ID_Gaji,
   ID_Pendapatan,
    Jumlah_Pendapatan,
    ID_Potongan,
    Jumlah_Potongan
) => {
  const data = {
   ID_Gaji,
   ID_Pendapatan,
   Jumlah_Pendapatan,
   ID_Potongan,
   Jumlah_Potongan
  };

  await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
    .where({ID_Gaji })
    .update(data);

  return {ID_Gaji, ...data };
};

module.exports =GajiDetailServiceEdit;
