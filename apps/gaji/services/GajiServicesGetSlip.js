const knexInstance = require('../../base/db');
const { GAJI_CONFIG_MAIN_TABLE   } = require('../config');
const BaseServiceQueryBuilder = require('../../base/services/BaseServiceQueryBuilder');

const GajiServiceGetSlip = async (many = false) => {
  const results = await BaseServiceQueryBuilder.fetchAll(GAJI_CONFIG_MAIN_TABLE);
  if (many) {
      return results;
  }

  return results[0];
};


module.exports = GajiServiceGetSlip;
