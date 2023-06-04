const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const _ = require("lodash");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE).where(
    { [field]: value }
  );

  if (many) return results;

  return results[0];
};

module.exports = PotonganServiceGet;
