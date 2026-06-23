const BaseServiceExcelColumnResponsive = (worksheets) => {
  worksheets.columns.forEach((column) => {
    const lengths = column.values.map((v) => v.toString().length);
    const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
    column.width = maxLength + 2;
  });
};

module.exports = BaseServiceExcelColumnResponsive;
