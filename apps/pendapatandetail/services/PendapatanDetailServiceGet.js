const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PENDAPATANDETAIL_CONFIG_MAIN_TABLE } = require("../config");
const _ = require("lodash");

const PendapatanDetailServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(
   PENDAPATANDETAIL_CONFIG_MAIN_TABLE
  ).where({ [field]: value });

  if (many) return results;

  const gaji = results[0];

  return gaji;
};

module.exports = PendapatanDetailServiceGet;
