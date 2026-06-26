const xl = require("exceljs");
const BaseServiceExcelColumnResponsive = require("../../base/services/BaseServiceExcelColumnResponsive");

const GajiServiceReportPeriodExcel = async (items) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(`report-gaji`);

  const headers = [
    "Nama Karyawan",
    "Total Pendapatan",
    "Total Potongan",
    "Gaji Bersih",
  ];

  const headerRow = ws.addRow(headers);

  items.forEach((item) => {
    const rowData = [
      item.Nama_Karyawan,
      item.Total_Pendapatan,
      item.Total_Potongan,
      item.Gaji_Bersih,
    ];
    ws.addRow(rowData);
  });

  BaseServiceExcelColumnResponsive(ws);

  return wb.xlsx;
};

module.exports = GajiServiceReportPeriodExcel;
