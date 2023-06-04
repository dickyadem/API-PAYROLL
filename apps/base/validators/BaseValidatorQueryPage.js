const { check } = require("express-validator");

const BaseValidatorQueryPage = () => {
  return check("page")
    .optional()
    .isNumeric()
    .isInt()
    .withMessage("Page harus berisi angka.")
    .bail()
    .customSanitizer((value) => parseInt(value));
};

module.exports = BaseValidatorQueryPage;
