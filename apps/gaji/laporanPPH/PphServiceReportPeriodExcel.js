const xl = require("excel4node");
const BaseServiceExcelColumnResponsive = require("../laporanPPH/BaseServiceExcelColumnResponsive");

const PphServiceReportPeriodExcel = async (profilData, items) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("report-pph");

    // Menambahkan data profil pada sheet
    const profilHeaders = [
        
        "Nama",
        "Alamat",
        "Telepon",
        "Fax",
        "Email",
        "Website"
    ];
    const profilValues = [
        profilData.Nama,
        profilData.Alamat,
        profilData.Telepon,
        profilData.Fax,
        profilData.Email,
        profilData.Website
    ];

    profilHeaders.forEach((header, index) => {
        ws.getCell(`A${index + 2}`).value = header;
        ws.getCell(`B${index + 2}`).value = profilValues[index];
    });

    // Menambahkan header tabel
    const headers = [
        "ID Gaji",
        "ID Karyawan",
        "Nama Karyawan",
        "Jumlah Potongan",
        "Total",
    ];
    const headerRow = ws.addRow(headers);

    // Mengisi data pada tabel
    items.forEach((item) => {
        const rowData = [
            item.ID_Gaji,
            item.ID_Karyawan,
            item.Nama_Karyawan,
            item.Jumlah_potongan,
            item.Total,
        ];
        ws.addRow(rowData);
    });

    BaseServiceExcelColumnResponsive(ws);

    return wb; // Mengembalikan objek Workbook
};

module.exports = PphServiceReportPeriodExcel;
