const xl = require("exceljs");
const {
  BASE_CONFIG_EXCEL_FONT_HEADER,
  BASE_CONFIG_EXCEL_BORDER,
  BASE_CONFIG_EXCEL_FILL_HEADER,
} = require("../../base/config");
const BaseServiceExcelColumnResponsive = require("../../base/services/BaseServiceExcelColumnResponsive");

const GajiServiceReportPeriodExcel = async (items) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(`report-gaji`);

  const keys = [
    "ID_Gaji",
    "Tanggal",
    "Nama Karyawan",
    "Divisi",
    "Total_Pendapatan",
    "Total_Potongan",
    "Gaji_Bersih",
  ];
  const headers = [
    ws.getCell("A1"),
    ws.getCell("B1"),
    ws.getCell("C1"),
    ws.getCell("D1"),
    ws.getCell("E1"),
    ws.getCell("F1"),
    ws.getCell("G1"),
  ];

  const itemCells = (row) => {
    return [
      ws.getCell("A" + row),
      ws.getCell("B" + row),
      ws.getCell("C" + row),
      ws.getCell("D" + row),
      ws.getCell("E" + row),
      ws.getCell("F" + row),
      ws.getCell("G" + row),
    ];
  };

  headers.forEach((cell, index) => {
    cell.font = BASE_CONFIG_EXCEL_FONT_HEADER;
    cell.border = BASE_CONFIG_EXCEL_BORDER;
    cell.fill = BASE_CONFIG_EXCEL_FILL_HEADER;
    cell.value = keys[index];
  });

  items.forEach((item, index) => {
    const row = index + 2;
    const cells = itemCells(row);
    cells[0].border = BASE_CONFIG_EXCEL_BORDER;
    cells[0].value = item.ID_Gaji;
    cells[1].border = BASE_CONFIG_EXCEL_BORDER;
    cells[1].value = item.Tanggal.toISOString().split("T")[0];
    cells[2].border = BASE_CONFIG_EXCEL_BORDER;
    cells[2].value = item.Nama_Karyawan;
    cells[3].border = BASE_CONFIG_EXCEL_BORDER;
    cells[3].value = item.Divisi;
    cells[4].border = BASE_CONFIG_EXCEL_BORDER;
    cells[4].value = item.Total_Pendapatan;
    cells[5].border = BASE_CONFIG_EXCEL_BORDER;
    cells[5].value = item.Total_Potongan;
    cells[6].border = BASE_CONFIG_EXCEL_BORDER;
    cells[6].value = item.Gaji_Bersih;
  });

  BaseServiceExcelColumnResponsive(ws);

  return wb.xlsx;
};

module.exports = GajiServiceReportPeriodExcel;
