const xl = require("exceljs");
const BaseServiceExcelColumnResponsive = require("../laporanBPJS/BaseServiceExcelColumnResponsive");

const BPJSServiceReportPeriodExcel = async ({ profilData, results: items }) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("report-bpjs");

    const profilHeaders = ["Nama", "Alamat", "Telepon", "Fax", "Email", "Website"];
    const profilValues = profilData
        ? [profilData.Nama, profilData.Alamat, profilData.Telepon, profilData.Fax, profilData.Email, profilData.Website]
        : ["", "", "", "", "", ""];

    profilHeaders.forEach((header, index) => {
        ws.getCell(`A${index + 2}`).value = header;
        ws.getCell(`B${index + 2}`).value = profilValues[index];
    });

    const headers = ["ID Gaji", "ID Karyawan", "Nama Karyawan", "Jumlah Potongan", "Total"];
    ws.addRow(headers);

    (items || []).forEach((item) => {
        ws.addRow([
            item.ID_Gaji,
            item.ID_Karyawan,
            item.Nama_Karyawan,
            item.Jumlah_potongan,
            item.Total,
        ]);
    });

    BaseServiceExcelColumnResponsive(ws);

    return wb.xlsx;
};

module.exports = BPJSServiceReportPeriodExcel;
