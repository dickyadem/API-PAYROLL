const PDFDocument = require('pdfkit');
const fs = require('fs');

// Fungsi untuk membuat laporan PDF
const createPDFReport = (data) => {
    // Buat objek PDFDocument baru
    const doc = new PDFDocument();

    // Tambahkan konten ke laporan PDF
    doc.text('Laporan Data Gaji', { align: 'center', fontSize: 20 });
    doc.moveDown();

    // Tambahkan tabel dengan header
    doc.table({
        headers: ['ID Gaji', 'Tanggal', 'Nama Karyawan', 'Divisi', 'Total Pendapatan', 'Total Potongan', 'Gaji Bersih'],
        rows: data.map(item => [item.ID_Gaji, item.Tanggal, item.Nama_Karyawan, item.Divisi, item.Total_Pendapatan, item.Total_Potongan, item.Gaji_Bersih]),
    });

    // Simpan laporan PDF ke file
    const pdfFilePath = './laporan_gaji.pdf';
    doc.pipe(fs.createWriteStream(pdfFilePath));
    doc.end();

    console.log(`Laporan PDF berhasil dibuat dan disimpan di file: ${pdfFilePath}`);
};

// Panggil fungsi untuk membuat laporan PDF berdasarkan data salaryData
createPDFReport(salaryData);
module.exports = createPDFReport;
