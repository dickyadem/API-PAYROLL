const xl = require('exceljs');
const BaseServiceExcelColumnResponsive = require('../../base/services/BaseServiceExcelColumnResponsive');
const GajiServiceFakturExcel = async (tblgaji) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(`faktur`);

  ws.getCell("A1").value = "ID Gaji";
  ws.getCell("B1").value = "Tanggal";
  ws.getCell("C1").value = "Nama Karyawan";
  ws.getCell("D1").value = "Divisi";
  ws.getCell("E1").value = "Total Pendapatan";
  ws.getCell("F1").value = "Total Potongan";
  ws.getCell("G1").value = "Gaji Bersih";

  // Menulis data pada baris kedua dan seterusnya
  tblgaji.forEach((item, index) => {
    const rowIndex = index + 2; // Mulai dari baris kedua
    ws.getCell(`A${rowIndex}`).value = item.ID_Gaji;
    ws.getCell(`B${rowIndex}`).value = item.Tanggal.toISOString().split("T")[0];
    ws.getCell(`C${rowIndex}`).value = item.Nama_Karyawan;
    ws.getCell(`D${rowIndex}`).value = item.Divisi;
    ws.getCell(`E${rowIndex}`).value = item.Total_Pendapatan;
    ws.getCell(`F${rowIndex}`).value = item.Total_Potongan;
    ws.getCell(`G${rowIndex}`).value = item.Gaji_Bersih;
  });

  BaseServiceExcelColumnResponsive(ws);
  return wb.xlsx;
};

module.exports = GajiServiceFakturExcel;
