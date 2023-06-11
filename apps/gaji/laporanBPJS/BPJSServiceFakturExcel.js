const xl = require('exceljs');
const BaseServiceExcelColumnResponsive = require('../laporanBPJS/BaseServiceExcelColumnResponsive');
const db = require('../../base/services/BaseServiceQueryBuilder');

const BPJSServiceFakturExcel = async () => {
    const tblgaji = await db.fetchAll('tblgaji');
    const tblkaryawan = await db.fetchAll('tblkaryawan');
    const tblgajidetail = await db.fetchAll('tblgajidetail', { ID_Potongan: '01' });
    const tblprofil = await db.fetchAll('tblprofil');

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Laporan Potongan BPJS');

    // Judul di atas tabel
    ws.getCell('A1').value = 'Laporan Potongan BPJS';
    ws.mergeCells('A1:D1');
    ws.getCell('A1').alignment = { horizontal: 'center' };
    ws.getCell('A1').font = { size: 20 };
    

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

    const profilData = Object.entries(tblprofil[0]);

    for (let i = 1; i < profilData.length; i++) {
        const row = i + 1; // Mulai dari baris pertama (A1)
        
        // Menambahkan teks tambahan pada urutan ketiga hingga keenam
        if (i === 3) {
            ws.getCell(`A${row}`).value = 'Telepon: ' + profilData[i][1];
        } else if (i === 4) {
            ws.getCell(`A${row}`).value = 'Fax: ' + profilData[i][1];
        } else if (i === 5) {
            ws.getCell(`A${row}`).value = 'Email: ' + profilData[i][1];
        } else if (i === 6) {
            ws.getCell(`A${row}`).value = 'Website: ' + profilData[i][1];
        } else {
            ws.getCell(`A${row}`).value = profilData[i][1];
        }
    }
    ws.getCell('A8').value = 'Tanggal: ' + new Date().toISOString().split('T')[0];

    ws.getCell('A9').value = 'ID GAji';
    ws.getCell('A9').border = tableBorder;
    ws.getCell('B9').value = 'ID Karyawan';
    ws.getCell('B9').border = tableBorder;
    ws.getCell('C9').value = 'Nama Karyawan';
    ws.getCell('C9').border = tableBorder;
    ws.getCell('D9').value = 'Jumlah potongan';
    ws.getCell('D9').border = tableBorder;

    for (let i = 0; i < tblgaji.length; i++) {
        const row = i + 10; // Mulai dari baris kedelapan (A8)
        ws.getCell(`A${row}`).value = tblgaji[i].ID_Gaji;
        ws.getCell(`A${row}`).border = tableBorder;
        ws.getCell(`B${row}`).value = tblkaryawan[i].ID_Karyawan;
        ws.getCell(`B${row}`).border = tableBorder;
        ws.getCell(`C${row}`).value = tblkaryawan[i].Nama_Karyawan;
        ws.getCell(`C${row}`).border = tableBorder;

        let totalPotongan = 0;
        for (let j = 0; j < tblgajidetail.length; j++) {
            if (tblgajidetail[j].ID_Potongan === '01' && tblgajidetail[j].ID_Gaji === tblgaji[i].ID_Gaji) {
                totalPotongan += tblgajidetail[j].Jumlah_Potongan;
            }
        }

        ws.getCell(`D${row}`).value = 'Rp. ' + totalPotongan;
        ws.getCell(`D${row}`).border = tableBorder;
    }

    // Menampilkan total potongan di baris terakhir
    const totalPotongan = tblgajidetail.reduce((total, item) => {
        if (item.ID_Potongan === '02') {
            return total + item.Jumlah_Potongan;
        }
        return total;
    }, 0);
    ws.getCell('C' + (tblgaji.length + 10)).value = 'Total';
    ws.getCell('D' + (tblgaji.length + 10)).value = 'Rp. ' + totalPotongan;
    ws.getCell('D' + (tblgaji.length + 10)).border = tableBorder;


    ws.getCell('A' + (tblgaji.length + 15)).value = 'Dibuat oleh:';
    ws.getCell('A' + (tblgaji.length + 15)).font = { bold: true };
    ws.getCell('A' + (tblgaji.length + 20)).value = '___________________';
  
    // TTD "Disetujui oleh"
    ws.getCell('D' + (tblgaji.length + 15)).value = 'Disetujui oleh:';
    ws.getCell('D' + (tblgaji.length + 15)).font = { bold: true };
    ws.getCell('D' + (tblgaji.length + 20)).value = '___________________';

    // Memanggil fungsi BaseServiceExcelColumnResponsive untuk mengatur lebar kolom secara responsif
    BaseServiceExcelColumnResponsive(ws);

    return wb.xlsx;
};

module.exports = BPJSServiceFakturExcel;
