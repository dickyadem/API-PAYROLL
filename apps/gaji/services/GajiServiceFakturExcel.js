const xl = require('exceljs');
const BaseServiceExcelColumnResponsive = require('../../base/services/BaseServiceExcelColumnResponsive');
const db = require('../../base/services/BaseServiceQueryBuilder'); // Ubah path ke file BaseServiceQueryBuilder

const GajiServiceFakturExcel = async () => {
  const tblgaji = await db.fetchAll('tblgaji'); // Mengambil data dari tabel tblgaji

  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Laporan Gaji');

  // Judul di atas tabel
  ws.getCell('A1').value = 'Laporan Gaji';
  ws.mergeCells('A1:G1'); // Menggabungkan sel untuk judul
  ws.getCell('A1').alignment = { horizontal: 'center' }; // Mengatur perataan teks ke tengah

  // Menambahkan border pada tabel
  const tableRange = 'A1:G' + (tblgaji.length + 2);
  const tableBorder = {
    style: 'thin',
    color: { argb: '00000000' }, // Warna border (hitam)
  };
  ws.getCell(tableRange).border = {
    top: tableBorder,
    left: tableBorder,
    bottom: tableBorder,
    right: tableBorder,
  };

  // Kolom pada tabel
  ws.getCell('A2').value = 'ID Gaji';
  ws.getCell('B2').value = 'Tanggal';
  ws.getCell('C2').value = 'Nama Karyawan';
  ws.getCell('D2').value = 'Divisi';
  ws.getCell('E2').value = 'Total Pendapatan';
  ws.getCell('F2').value = 'Total Potongan';
  ws.getCell('G2').value = 'Gaji Bersih';

  // Mengambil data dari tabel tblkaryawan
  const tblkaryawan = await db.fetchAll('tblkaryawan');

  // Menulis data pada baris kedua dan seterusnya
  tblgaji.forEach((item, index) => {
    const rowIndex = index + 3; // Mulai dari baris ketiga (setelah judul dan kolom)

    ws.getCell(`A${rowIndex}`).value = item.ID_Gaji;
    ws.getCell(`B${rowIndex}`).value = item.Tanggal.toISOString().split('T')[0];

    // Mencari data karyawan berdasarkan ID_Karyawan
    const karyawan = tblkaryawan.find((k) => k.ID_Karyawan === item.ID_Karyawan);
    if (karyawan) {
      ws.getCell(`C${rowIndex}`).value = karyawan.Nama_Karyawan;
      ws.getCell(`D${rowIndex}`).value = karyawan.Divisi;
    }

    ws.getCell(`E${rowIndex}`).value = item.Total_Pendapatan;
    ws.getCell(`F${rowIndex}`).value = item.Total_Potongan;
    ws.getCell(`G${rowIndex}`).value = item.Gaji_Bersih;
  });

  // TTD "Dibuat oleh"
  ws.getCell('A' + (tblgaji.length + 4)).value = 'Dibuat oleh:';
  ws.getCell('A' + (tblgaji.length + 4)).font = { bold: true };
  ws.getCell('A' + (tblgaji.length + 8)).value = '___________________';

  // TTD "Disetujui oleh"
  ws.getCell('F' + (tblgaji.length + 4)).value = 'Disetujui oleh:';
  ws.getCell('F' + (tblgaji.length + 4)).font = { bold: true };
  ws.getCell('F' + (tblgaji.length + 8)).value = '___________________';

  BaseServiceExcelColumnResponsive(ws);
  return wb.xlsx;
};

module.exports = GajiServiceFakturExcel;
