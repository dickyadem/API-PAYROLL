const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_MAIN_TABLE } = require("../config");

const GajiServiceReportPeriod = async (startDate, endDate, terms) => {
  let subQuery = await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
    .clone()
    .select("ID_Gaji")
    .whereBetween("Tanggal", [startDate, endDate]);

  subQuery = JSON.parse(JSON.stringify(subQuery)).map((item) => item.ID_Gaji);

  let results = BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
    .select(["tblkaryawan.Nama_Karyawan"])
    .innerJoin("tblkaryawan", "tblgaji.ID_Karyawan", "tblkaryawan.ID_Karyawan")
    .whereIn("tblgaji.ID_Gaji", subQuery);

  if (terms) {
    results = await results
      .sum("tblgaji.Total_Pendapatan as Total_Pendapatan")
      .sum("tblgaji.Total_Potongan as Total_Potongan")
      .sum("tblgaji.Gaji_Bersih as Gaji_Bersih")
      .where("tblgaji.Keterangan", "like", `%${terms}%`)
      .groupBy("tblkaryawan.Nama_Karyawan");
  } else {
    results = await results
      .sum("tblgaji.Total_Pendapatan as Total_Pendapatan")
      .sum("tblgaji.Total_Potongan as Total_Potongan")
      .sum("tblgaji.Gaji_Bersih as Gaji_Bersih")
      .groupBy("tblkaryawan.Nama_Karyawan");
  }

  return results;
};

module.exports = GajiServiceReportPeriod;
