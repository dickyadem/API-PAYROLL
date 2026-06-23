const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const {
  GAJI_CONFIG_MAIN_TABLE,
  PENDAPATANDETAIL_CONFIG_MAIN_TABLE,
  POTONGANDETAIL_CONFIG_MAIN_TABLE
} = require("../config");

const GajiServiceDelete = async (ID_Gaji) => {
  // Check if gaji exists
  const existingGaji = await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
    .where({ ID_Gaji })
    .first();

  if (!existingGaji) {
    throw new Error('Data gaji tidak ditemukan');
  }

  await BaseServiceQueryBuilder.transaction(async (trx) => {
    // 1. Delete from tblpendapatandetail (cascade delete itemsPendapatan)
    await BaseServiceQueryBuilder(PENDAPATANDETAIL_CONFIG_MAIN_TABLE)
      .where({ ID_Gaji })
      .del()
      .transacting(trx);

    // 2. Delete from tblpotongandetail (cascade delete itemsPotongan)
    await BaseServiceQueryBuilder(POTONGANDETAIL_CONFIG_MAIN_TABLE)
      .where({ ID_Gaji })
      .del()
      .transacting(trx);

    // 3. Delete from tblgaji (main table)
    await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
      .where({ ID_Gaji })
      .del()
      .transacting(trx);
  });

  return {
    message: 'Data gaji berhasil dihapus',
    ID_Gaji
  };
};

module.exports = GajiServiceDelete;
