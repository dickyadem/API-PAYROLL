module.exports = {
    BASE_CONFIG_EXCEL_FILL_HEADER: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "FF0000FF" },
    },
    BASE_CONFIG_EXCEL_FONT_HEADER: { family: 4, size: 10, bold: true },
    BASE_CONFIG_EXCEL_ALIGNMENT_HEADER_STRING: {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
    },
    BASE_CONFIG_EXCEL_ALIGNMENT_HEADER_NUMBER: {
        vertical: "middle",
        horizontal: "right",
        wrapText: true,
    },
    BASE_CONFIG_EXCEL_BORDER: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
    },
};
