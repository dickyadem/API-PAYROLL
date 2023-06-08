const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");

// Fungsi untuk mengambil data penggajian dari database SQL
const getSalaryDataFromSQL = () => {
  return new Promise((resolve, reject) => {
    // Menggunakan konfigurasi koneksi dari BaseServiceQueryBuilder
    const queryBuilder = BaseServiceQueryBuilder();

    // Melakukan query SELECT pada tabel penggajian
    queryBuilder.select().from("penggajian").then((results) => {
      resolve(results);
    }).catch((error) => {
      reject(error);
    });
  });
};

// Menggunakan fungsi untuk mendapatkan data penggajian dari SQL
getSalaryDataFromSQL()
  .then((salaryData) => {
    // Gunakan data penggajian dari SQL untuk membuat laporan PDF
    createPDFReport(salaryData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = getSalaryDataFromSQL;