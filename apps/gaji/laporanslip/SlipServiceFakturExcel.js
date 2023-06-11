const xl = require('exceljs');
const BaseServiceExcelColumnResponsive = require('../laporanBPJS/BaseServiceExcelColumnResponsive');
const db = require('../../base/services/BaseServiceQueryBuilder');

const createPayslipExcel = async () => {
    const tblgaji = await db.fetchAll('tblgaji');
    const tblkaryawan = await db.fetchAll('tblkaryawan');
    const tblgajidetail = await db.fetchAll('tblgajidetail');
    const tblgolongan = await db.fetchAll('tblgolongan');
    const tbljabatan = await db.fetchAll('tbljabatan');
    const tblpendapatan = await db.fetchAll('tblpendapatan');
    const tblpotongan = await db.fetchAll('tblpotongan');

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Laporan Slip Gaji Karyawan');
    const tableBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    // Judul
    ws.getCell('A1').value = 'Laporan Slip Gaji Karyawan';
    ws.getCell('A1').font = { size: 20 };
    ws.mergeCells('A1:D1');
    ws.getCell('A1').alignment = { horizontal: 'center' };

    // Tanggal
    ws.getCell('A4').value = 'Tanggal';
    ws.getCell('A4').font = { bold: true };
    ws.getCell('A4').textAlign = 'center';
    ws.getCell('B4').value = tblgaji[0].Tanggal;


    // ID Gaji
    ws.getCell('A3').value = 'ID Gaji';
    ws.getCell('A3').font = { bold: true };
    ws.getCell('B3').value = tblgaji[0].ID_Gaji;

    // Golongan
    ws.getCell('A5').value = 'Golongan';
    ws.getCell('A5').font = { bold: true };
    ws.getCell('B5').value = tblgolongan[0].Nama_Golongan;

    // ID Karyawan
    ws.getCell('C3').value = 'ID Karyawan';
    ws.getCell('C3').font = { bold: true };
    ws.getCell('D3').value = tblkaryawan[0].ID_Karyawan;

    // Nama Karyawan
    ws.getCell('C4').value = 'Nama Karyawan';
    ws.getCell('C4').font = { bold: true };
    ws.getCell('D4').value = tblkaryawan[0].Nama_Karyawan;

    // Jabatan
    ws.getCell('C5').value = 'Jabatan';
    ws.getCell('C5').font = { bold: true };
    ws.getCell('D5').value = tbljabatan[0].Nama_Jabatan;

    // Kolom Pendapatan
    ws.getCell('A7').value = 'Pendapatan';
    ws.getCell('A7').font = { bold: true };
    ws.getCell('A7').border = tableBorder;
    // Kolom JUMLAH
    ws.getCell('B7').value = 'Jumlah';
    ws.getCell('B7').font = { bold: true };
    ws.getCell('B7').textAlign = 'center';
    ws.getCell('B7').border = tableBorder;

    // List Nama Pendapatan
    for (let i = 0; i < tblpendapatan.length; i++) {
        const row = i + 8;
        const namaPendapatan = tblpendapatan[i].Nama_Pendapatan;

        ws.getCell(`A${row}`).value = namaPendapatan;

        // Find gajiDetail based on ID_Gaji and ID_Pendapatan
        const gajiDetail = tblgajidetail.find(item => item.ID_Gaji === tblgaji[0].ID_Gaji && item.ID_Pendapatan === tblpendapatan[i].ID_Pendapatan);
        if (gajiDetail) {
            const jumlahPendapatan = gajiDetail.Jumlah_Pendapatan;
            ws.getCell(`B${row}`).value = jumlahPendapatan;
        } else {
            ws.getCell(`B${row}`).value = 0;
        }


        // Get the ID_Gaji from tblgaji
        const ID_Gaji = tblgaji[0].ID_Gaji;

        // Filter tblgajidetail based on the ID_Gaji
        const gajiDetails = tblgajidetail.filter(item => item.ID_Gaji === ID_Gaji);

        // Calculate Total_Jumlah
        const totalJumlah = gajiDetails.reduce((total, item) => {
            return total + item.Jumlah_Pendapatan;
        }, 0);

        // Display Total_Jumlah
        const totalJumlahRow = tblpendapatan.length + 8;
        ws.getCell(`A${totalJumlahRow}`).value = 'Total_Jumlah';
        ws.getCell(`A${totalJumlahRow}`).textAlign = 'center';
        ws.getCell(`A${totalJumlahRow}`).border = tableBorder;
        ws.getCell(`B${totalJumlahRow}`).value = totalJumlah;
        ws.getCell(`B${totalJumlahRow}`).font = { bold: true };
        ws.getCell(`B${totalJumlahRow}`).border = tableBorder;

    }

    // Kolom Potongan
    ws.getCell('C7').value = 'Potongan';
    ws.getCell('C7').font = { bold: true };
    ws.getCell('C7').border = tableBorder;
    ws.getCell('C7').textAlign = 'center';


    // List Nama Potongan
    for (let i = 0; i < tblpotongan.length; i++) {
        const row = i + 8;
        ws.getCell(`C${row}`).value = tblpotongan[i].Nama_Potongan;
    }
    ws.getCell('D7').value = 'Jumlah';
    ws.getCell('D7').font = { bold: true };
    ws.getCell('D7').textAlign = 'center';
    ws.getCell('D7').border = tableBorder;

    // List Nama Potongan
    for (let i = 0; i < tblpotongan.length; i++) {
        const row = i + 8;
        const namaPotongan = tblpotongan[i].Nama_Potongan;

        ws.getCell(`A${row}`).value = namaPotongan;

        // Find gajiDetail based on ID_Gaji and ID_Potongan
        const gajiDetail = tblgajidetail.find(item => item.ID_Gaji === tblgaji[0].ID_Gaji && item.ID_Potongan === tblpotongan[i].ID_Potongan);
        if (gajiDetail) {
            const jumlahPotongan = gajiDetail.Jumlah_Potongan;
            ws.getCell(`D${row}`).value = jumlahPotongan;

        } else {
            ws.getCell(`D${row}`).value = 0;
        }

        // Get the ID_Gaji from tblgaji
        const ID_Gaji = tblgaji[0].ID_Gaji;

        // Filter tblgajidetail based on the ID_Gaji
        const gajiDetails = tblgajidetail.filter(item => item.ID_Gaji === ID_Gaji);

        // Calculate Total_Jumlah
        const totalJumlah = gajiDetails.reduce((total, item) => {
            return total + item.Jumlah_Potongan;
        }, 0);

        // Display Total_Jumlah
        const totalJumlahRow = tblpotongan.length + 8;
        ws.getCell(`C${totalJumlahRow}`).value = 'Total_Jumlah';
        ws.getCell(`C${totalJumlahRow}`).textAlign = 'center';
        ws.getCell(`C${totalJumlahRow}`).border = tableBorder;
        ws.getCell(`D${totalJumlahRow}`).value = totalJumlah;
        ws.getCell(`D${totalJumlahRow}`).font = { bold: true };
        ws.getCell(`D${totalJumlahRow}`).textAlign = 'center';
        ws.getCell(`D${totalJumlahRow}`).border = tableBorder;
    }
    BaseServiceExcelColumnResponsive(ws);

    return wb.xlsx;
};

module.exports = createPayslipExcel;
