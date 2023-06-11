const xl = require("exceljs");
const BaseServiceExcelColumnResponsive = require("../../base/services/BaseServiceExcelColumnResponsive");
const fetchKaryawanData = require("./fetchKaryawanData");
const {
  BASE_CONFIG_EXCEL_FONT_HEADER,
  BASE_CONFIG_EXCEL_FILL_HEADER,
  BASE_CONFIG_EXCEL_BORDER,
} = require("../../base/config");

const GajiServiceFakturExcel = async (tblgaji) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(`faktur`);

  const headers = [
    "ID Gaji",
    "Tanggal",
    "Nama Karyawan",
    "Divisi",
    "Total Pendapatan",
    "Total Potongan",
    "Gaji Bersih",
  ];

  const headerRow = ws.getRow(1);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = BASE_CONFIG_EXCEL_FONT_HEADER;
    cell.fill = BASE_CONFIG_EXCEL_FILL_HEADER;
    cell.border = BASE_CONFIG_EXCEL_BORDER;
  });

  

  // Fetch data dari tblkaryawan berdasarkan ID_Karyawan
  const karyawan = await fetchKaryawanData(tblgaji.ID_Karyawan);
  ws.getCell("A1").value = "ID Gaji";
  ws.getCell("B1").value = "Tanggal";
  ws.getCell("C1").value = "Nama Karyawan";
  ws.getCell("D1").value = "Divisi";
  ws.getCell("E1").value = "Total Pendapatan";
  ws.getCell("F1").value = "Total Potongan";
  ws.getCell("G2").value = "Gaji Bersih";
  ws.getCell("A2").value = tblgaji.ID_Gaji;
  ws.getCell("B2").value = tblgaji.Tanggal.toISOString().split("T")[0];
  ws.getCell("C2").value = karyawan.Nama_Karyawan;
  ws.getCell("D2").value = karyawan.Divisi;
  ws.getCell("E2").value = tblgaji.Total_Pendapatan;
  ws.getCell("F2").value = tblgaji.Total_Potongan;
  ws.getCell("G2").value = tblgaji.Gaji_Bersih;

  BaseServiceExcelColumnResponsive(ws);
  return wb.xlsx;
};

module.exports = GajiServiceFakturExcel;
