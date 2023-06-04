const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PEMBELIAN_CONFIG_MAIN_TABLE } = require("../config");
const _ = require("lodash");

const PembelianServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(
    PEMBELIAN_CONFIG_MAIN_TABLE
  ).where({ [field]: value });

  if (many) return results;

  const pembelian = results[0];

  return pembelian;
};

module.exports = PembelianServiceGet;
