const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_MAIN_TABLE } = require("../config");

const GajiServiceReportPeriod = async (startDate, endDate, terms) => {
  let subQuery = await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
    .clone()
    .select("ID_Gaji")
    .whereBetween("Tanggal", [startDate, endDate]);

  subQuery = JSON.parse(JSON.stringify(subQuery)).map((item) => item.ID_Gaji);

  let results = BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
    .select([
      "tblgaji.ID_Gaji",
      "tblgaji.Tanggal",
      "tblkaryawan.Nama_Karyawan",
      "tblkaryawan.Divisi",
      "tblgaji.Total_Pendapatan",
      "tblgaji.Total_Potongan",
      "tblgaji.Gaji_Bersih",
    ])
    .innerJoin("tblkaryawan", "tblgaji.ID_Karyawan", "tblkaryawan.ID_Karyawan")
    .whereIn("tblgaji.ID_Gaji", subQuery);

  if (terms) {
    results = await results
      .sum("tblgaji.Total_Pendapatan as Total_Pendapatan")
      .sum("tblgaji.Total_Potongan as Total_Potongan")
      .sum("tblgaji.Gaji_Bersih as Gaji_Bersih")
      .whereILike("tblgaji.Keterangan", `%${terms}%`)
      .groupBy("tblkaryawan.Nama_Karyawan", "tblkaryawan.Divisi");
  } else {
    results = await results
      .sum("tblgaji.Total_Pendapatan as Total_Pendapatan")
      .sum("tblgaji.Total_Potongan as Total_Potongan")
      .sum("tblgaji.Gaji_Bersih as Gaji_Bersih")
      .groupBy("tblkaryawan.Nama_Karyawan", "tblkaryawan.Divisi");
  }

  return results;
};

module.exports = GajiServiceReportPeriod;
