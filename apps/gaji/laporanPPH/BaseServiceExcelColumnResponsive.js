const BaseServiceExcelColumnResponsive = (worksheet) => {
    worksheet.columns.forEach((column) => {
        const lengths = column.values.map((v) => v ? v.toString().length : 0);
        const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
        column.width = maxLength + 2;
    });
};

module.exports = BaseServiceExcelColumnResponsive;
