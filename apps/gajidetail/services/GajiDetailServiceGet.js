const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { 
  GAJIDETAIL_CONFIG_MAIN_TABLE,
  PENDAPATANDETAIL_CONFIG_MAIN_TABLE, 
  POTONGANDETAIL_CONFIG_MAIN_TABLE 
} = require("../config");
const _ = require("lodash");

const GajiServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(
    GAJIDETAIL_CONFIG_MAIN_TABLE
  ).where({ [field]: value });

  if (many) return results;

  const gaji = results[0];

  if (!gaji) return null;

  // Fetch itemsPendapatan from tblpendapatandetail
  const itemsPendapatan = await BaseServiceQueryBuilder(
    PENDAPATANDETAIL_CONFIG_MAIN_TABLE
  ).where({ ID_Gaji: gaji.ID_Gaji });

  // Fetch itemsPotongan from tblpotongandetail
  const itemsPotongan = await BaseServiceQueryBuilder(
    POTONGANDETAIL_CONFIG_MAIN_TABLE
  ).where({ ID_Gaji: gaji.ID_Gaji });

  return {
    ...gaji,
    itemsPendapatan: itemsPendapatan || [],
    itemsPotongan: itemsPotongan || []
  };
};

module.exports = GajiServiceGet;
