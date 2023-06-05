const xl = require("exceljs");
const {
    BASE_CONFIG_EXCEL_FONT_HEADER,
    BASE_CONFIG_EXCEL_BORDER,
    BASE_CONFIG_EXCEL_FILL_HEADER,
} = require("../../base/config");
const BaseServiceExcelColumnResponsive = require("../../base/services/BaseServiceExcelColumnResponsive");

const PembelianServiceReportPeriodExcel = async (items) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(`report-pembelian`);

    const keys = [
        "KODE BARANG",
        "NAMA BARANG",
        "HARGA BELI",
        "JUMLAH BELI",
        "SUBTOTAL",
    ];
    const headers = [
        ws.getCell("A1"),
        ws.getCell("B1"),
        ws.getCell("C1"),
        ws.getCell("D1"),
        ws.getCell("E1"),
    ];

    const itemCells = (row) => {
        return [
            ws.getCell("A" + row),
            ws.getCell("B" + row),
            ws.getCell("C" + row),
            ws.getCell("D" + row),
            ws.getCell("E" + row),
        ];
    };

    Object.values(headers).map((cell, index) => {
        cell.font = BASE_CONFIG_EXCEL_FONT_HEADER;
        cell.border = BASE_CONFIG_EXCEL_BORDER;
        cell.fill = BASE_CONFIG_EXCEL_FILL_HEADER;
        cell.value = keys[index];
    });

    JSON.parse(JSON.stringify(items)).map((item, index) => {
        const row = index + 2;
        Object.values(item).map((value, i) => {
            const cells = itemCells(row);
            cells[i].border = BASE_CONFIG_EXCEL_BORDER;
            cells[i].value = value;
        });
    });

    BaseServiceExcelColumnResponsive(ws);

    return wb.xlsx;
};

module.exports = PembelianServiceReportPeriodExcel;
