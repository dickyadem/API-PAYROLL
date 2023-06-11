const xl = require('exceljs');
const BaseServiceExcelColumnResponsive = require('../laporanPPH/BaseServiceExcelColumnResponsive');
const db = require('../../base/services/BaseServiceQueryBuilder');

const PphServiceFakturExcel = async () => {
    const tblgaji = await db.fetchAll('tblgaji');
    const tblkaryawan = await db.fetchAll('tblkaryawan');
    const tblgajidetail = await db.fetchAll('tblgajidetail', { ID_Potongan: '02' });

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Laporan Potongan PPH');

    // Judul di atas tabel
    ws.getCell('A1').value = 'Laporan Potongan PPH';
    ws.mergeCells('A1:E1');
    ws.getCell('A1').alignment = { horizontal: 'center' };

    // Menambahkan border pada tabel
    const tableRange = 'A1:E' + (tblgaji.length + 4);
    const tableBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    ws.getCell(tableRange).border = {
        top: tableBorder,
        left: tableBorder,
        bottom: tableBorder,
        right: tableBorder,
    };

    // Kolom pada tabel
    ws.getCell('A2').value = 'ID_Gaji';
    ws.getCell('A2').border = tableBorder;
    ws.getCell('B2').value = 'ID_Karyawan';
    ws.getCell('B2').border = tableBorder;
    ws.getCell('C2').value = 'Nama_Karyawan';
    ws.getCell('C2').border = tableBorder;
    ws.getCell('D2').value = 'Jumlah_potongan';
    ws.getCell('D2').border = tableBorder;

    // Mengisi data pada tabel
    for (let i = 0; i < tblgaji.length; i++) {
        const row = i + 3;
        ws.getCell(`A${row}`).value = tblgaji[i].ID_Gaji;
        ws.getCell(`A${row}`).border = tableBorder;
        ws.getCell(`B${row}`).value = tblkaryawan[i].ID_Karyawan;
        ws.getCell(`B${row}`).border = tableBorder;
        ws.getCell(`C${row}`).value = tblkaryawan[i].Nama_Karyawan;
        ws.getCell(`C${row}`).border = tableBorder;

        let totalPotongan = 0;
        for (let j = 0; j < tblgajidetail.length; j++) {
            if (tblgajidetail[j].ID_Gaji === tblgaji[i].ID_Gaji) {
                totalPotongan += tblgajidetail[j].Jumlah_Potongan;
            }
        }

        ws.getCell(`D${row}`).value = totalPotongan;
        
    }

    // Total potongan di luar tabel
    const totalPotongan = tblgajidetail.reduce((total, item) => total + item.Jumlah_Potongan, 0);
    ws.getCell('C' + (tblgaji.length + 3)).value = 'Total';
    ws.getCell('D' + (tblgaji.length + 3)).value = totalPotongan;
    ws.getCell('D' + (tblgaji.length + 3)).border = tableBorder;

    // Memanggil fungsi BaseServiceExcelColumnResponsive untuk mengatur lebar kolom secara responsif
    BaseServiceExcelColumnResponsive(ws);

    return wb.xlsx;
};

module.exports = PphServiceFakturExcel;
