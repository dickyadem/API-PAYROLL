const xl = require("excel4node");
const BaseServiceExcelColumnResponsive = require("../laporanPPH/BaseServiceExcelColumnResponsive");

const PphServiceReportPeriodExcel = async (items) => {
    const wb = new xl.Workbook();
     
    const ws = wb.getWorksheet("report-pph");

    const headers = [
        "ID Gaji",
        "ID Karyawan",
        "Nama Karyawan",
        "Jumlah Potongan",
        "Total",
    ];

    const headerRow = ws.addRow(headers);

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
