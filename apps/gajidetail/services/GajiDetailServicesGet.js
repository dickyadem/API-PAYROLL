const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const _ = require("lodash");
const { GAJIDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const GajiDetailServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE).where(
    { [field]: value }
  );

  if (many) return results;

  return results[0];
};

module.exports =GajiDetailServiceGet;
