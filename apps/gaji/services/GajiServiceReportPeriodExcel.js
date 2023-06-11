const GajiServiceReportPeriodExcel = async (items) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(`report-gaji`);

  const headers = [
    "ID Gaji",
    "Tanggal",
    "Nama Karyawan",
    "Divisi",
    "Total Pendapatan",
    "Total Potongan",
    "Gaji Bersih",
  ];

  const headerRow = ws.addRow(headers);

  items.forEach((item) => {
    const rowData = [
      item.ID_Gaji,
      item.Tanggal.toISOString().split("T")[0],
      item.Nama_Karyawan,
      item.Divisi,
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
