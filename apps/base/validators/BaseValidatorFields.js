const { param, body, query } = require("express-validator");

const BaseValidatorFields = {
    locator: { param, body, query },
    page: (location = query, field = "page") => {
        return location(field)
            .optional()
            .isNumeric()
            .isInt()
            .withMessage("Page harus berisi angka.")
            .bail()
            .customSanitizer((value) => parseInt(value));
    },
    terms: (location = body, field = "terms") => {
        return location(field)
            .optional()
            .notEmpty()
            .withMessage("Term harus diisi.")
            .trim();
    },
};

module.exports = BaseValidatorFields;
