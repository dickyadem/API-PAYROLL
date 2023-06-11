const knex = require('knex'); // Import library knex.js sesuai versi yang Anda gunakan
const { GAJI_CONFIG_MAIN_TABLE   } = require('../config');
const BaseServiceQueryBuilder = require('../../base/services/BaseServiceQueryBuilder');

// Inisialisasi knex.js
const knexInstance = knex({
  // Konfigurasi koneksi database
  client: 'mysql', // Ganti dengan jenis database yang Anda gunakan
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "payroll",
  },
});

const GajiServiceGetSlip = async (many = false) => {
  const results = await BaseServiceQueryBuilder.fetchAll(GAJI_CONFIG_MAIN_TABLE);
  if (many) {
      return results;
  }

  return results[0];
};


module.exports = GajiServiceGetSlip;
