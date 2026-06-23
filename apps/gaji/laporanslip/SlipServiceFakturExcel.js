const xl = require('exceljs');
const BaseServiceExcelColumnResponsive = require('../laporanBPJS/BaseServiceExcelColumnResponsive');
const db = require('../../base/services/BaseServiceQueryBuilder');

const createPayslipExcel = async (ID_Gaji) => {
    const tblgaji = await db.fetchAll('tblgaji');
    const tblkaryawan = await db.fetchAll('tblkaryawan');
    const tblgajidetail = await db.fetchAll('tblgajidetail');
    const tblpendapatandetail = await db.fetchAll('tblpendapatandetail');
    const tblpotongandetail = await db.fetchAll('tblpotongandetail');
    const tblgolongan = await db.fetchAll('tblgolongan');
    const tbljabatan = await db.fetchAll('tbljabatan');
    const tblpendapatan = await db.fetchAll('tblpendapatan');
    const tblpotongan = await db.fetchAll('tblpotongan');
    const total = ID_Gaji;
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
    const tgl = tblgaji.find(gaji => gaji.ID_Gaji === total);
    if (tgl) {
        ws.getCell('B4').value = tgl.Tanggal;

        // ID Gaji
        ws.getCell('A3').value = 'ID Gaji';
        ws.getCell('A3').font = { bold: true };
        ws.getCell('B3').value = ID_Gaji;



        // ID Karyawan
        ws.getCell('C3').value = 'ID Karyawan';
        ws.getCell('C3').font = { bold: true };
        ws.getCell('D3').value = tgl.ID_Karyawan;

        const karyawan = tblkaryawan.find(karyawan => karyawan.ID_Karyawan === tgl.ID_Karyawan);
        if (karyawan) {
            // Nama Karyawan
            ws.getCell('C4').value = 'Nama Karyawan';
            ws.getCell('C4').font = { bold: true };
            ws.getCell('D4').value = karyawan.Nama_Karyawan;

            // Cari data jabatan berdasarkan ID_Jabatan dari data karyawan
            const jabatan = tbljabatan.find(jabatan => jabatan.ID_Jabatan === karyawan.ID_Jabatan);
            if (jabatan) {
                // Jabatan
                ws.getCell('C5').value = 'Jabatan';
                ws.getCell('C5').font = { bold: true };
                ws.getCell('D5').value = jabatan.Nama_Jabatan;
            }

            // Cari data golongan berdasarkan ID_Golongan dari data karyawan
            const golongan = tblgolongan.find(golongan => golongan.ID_Golongan === karyawan.ID_Golongan);
            if (golongan) {
                // Golongan
                ws.getCell('A5').value = 'Golongan';
                ws.getCell('A5').font = { bold: true };
                ws.getCell('B5').value = golongan.Nama_Golongan;
            }
        }
    }


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

        // Find PendapatanDetail based on ID_Gaji and ID_Pendapatan
        const PendapatanDetail = await tblpendapatandetail.find(
            (item) =>
                item.ID_Gaji === ID_Gaji && item.ID_Pendapatan === tblpendapatan[i].ID_Pendapatan
        );
        if (PendapatanDetail) {
            const jumlahPendapatan = PendapatanDetail.Jumlah_Pendapatan;
            ws.getCell(`B${row}`).value = 'Rp .' + jumlahPendapatan;
        } else {
            ws.getCell(`B${row}`).value = 0;
        }
    }

    // Calculate Total_Jumlah Pendapatan
    const totalJumlahPendapatan = tblpendapatandetail
        .filter((item) => item.ID_Gaji === ID_Gaji)
        .reduce((total, item) => total + item.Jumlah_Pendapatan, 0);

    // Display Total_Jumlah Pendapatan
    const totalJumlahPendapatanRow = tblpendapatan.length + 8;
    ws.getCell(`A${totalJumlahPendapatanRow}`).value = 'Total Pendapatan';
    ws.getCell(`A${totalJumlahPendapatanRow}`).textAlign = 'center';
    ws.getCell(`A${totalJumlahPendapatanRow}`).border = tableBorder;
    ws.getCell(`B${totalJumlahPendapatanRow}`).value = 'Rp. ' + totalJumlahPendapatan;
    ws.getCell(`B${totalJumlahPendapatanRow}`).font = { bold: true };
    ws.getCell(`B${totalJumlahPendapatanRow}`).border = tableBorder;
    // Kolom JUMLAH
    ws.getCell('D7').value = 'Jumlah';
    ws.getCell('D7').font = { bold: true };
    ws.getCell('D7').textAlign = 'center';
    ws.getCell('D7').border = tableBorder;
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

    // List Jumlah Potongan
    for (let i = 0; i < tblpotongan.length; i++) {
        const row = i + 8;
        const namaPotongan = tblpotongan[i].Nama_Potongan;

        ws.getCell(`C${row}`).value = namaPotongan;

        // Find gajiDetail based on ID_Gaji and ID_Potongan
        const PotonganDetail = tblpotongandetail.find(
            (item) =>
                item.ID_Gaji === ID_Gaji && item.ID_Potongan === tblpotongan[i].ID_Potongan
        );
        if (PotonganDetail) {
            const jumlahPotongan = PotonganDetail.Jumlah_Potongan;
            ws.getCell(`D${row}`).value = 'Rp. ' + jumlahPotongan;
        } else {
            ws.getCell(`D${row}`).value = 0;
        }
    }

    // Calculate Total_Jumlah Potongan
    const totalJumlahPotongan = tblpotongandetail
        .filter((item) => item.ID_Gaji === ID_Gaji)
        .reduce((total, item) => total + item.Jumlah_Potongan, 0);

    // Display Total_Jumlah Potongan
    const totalJumlahPotonganRow = tblpotongan.length + 8;
    ws.getCell(`C${totalJumlahPotonganRow}`).value = 'Total Potongan';
    ws.getCell(`C${totalJumlahPotonganRow}`).textAlign = 'center';
    ws.getCell(`C${totalJumlahPotonganRow}`).border = tableBorder;
    const gaji = tblgaji.find(gaji => gaji.ID_Gaji === total);
    if (gaji) {
        ws.getCell(`D${totalJumlahPotonganRow}`).value = 'Rp. ' + gaji.Total_Potongan;
        ws.getCell(`D${totalJumlahPotonganRow}`).font = { bold: true };
        ws.getCell(`D${totalJumlahPotonganRow}`).textAlign = 'center';
        ws.getCell(`D${totalJumlahPotonganRow}`).border = tableBorder;
    } else {
        // Handle case when matching gaji object is not found
        // For example, display an error message or assign a default value to the cell
    }
    const bersih = tblgaji.find(gaji => gaji.ID_Gaji === total);
    if (bersih) {
        const gajibersih = tblpotongan.length + 9;
        ws.getCell(`C${gajibersih}`).value = 'Gaji Bersih ';
        ws.getCell(`C${gajibersih}`).textAlign = 'center';
        ws.getCell(`C${gajibersih}`).border = tableBorder;
        ws.getCell(`D${gajibersih}`).value = 'Rp. ' + bersih.Gaji_Bersih;
        ws.getCell(`D${gajibersih}`).border = tableBorder;
    } else {
        // Handle case when matching gaji object is not found
        // For example, display an error message or assign a default value to the cell
    }


    const totalp = tblpotongan.length + 11;
    ws.getCell('A' + (totalp)).value = 'Bagian Keuangan:';
    ws.getCell('A' + (totalp)).font = { bold: true };
    ws.getCell('D' + (totalp)).value = 'Karyawan:';
    ws.getCell('D' + (totalp)).font = { bold: true };


    const hasilttd = tblpotongan.length + 17;
    ws.getCell('A' + (hasilttd)).value = '___________________';
    ws.getCell('D' + (hasilttd)).value = tblkaryawan[0].Nama_Karyawan;
    BaseServiceExcelColumnResponsive(ws);

    return wb.xlsx;
};

module.exports = createPayslipExcel;