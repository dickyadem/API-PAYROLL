const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const _ = require("lodash");
const { PENDAPATAN_CONFIG_MAIN_TABLE } = require("../config");

const PendapatanServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(PENDAPATAN_CONFIG_MAIN_TABLE).where(
    { [field]: value }
  );

  if (many) return results;

  return results[0];
};

module.exports = PendapatanServiceGet;
