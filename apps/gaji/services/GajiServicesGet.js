const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_MAIN_TABLE } = require("../config");
const _ = require("lodash");

const GajiServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(
    GAJI_CONFIG_MAIN_TABLE
  ).where({ [field]: value });

  if (many) return results;

  const gaji = results[0];

  return gaji;
};

module.exports = GajiServiceGet;
