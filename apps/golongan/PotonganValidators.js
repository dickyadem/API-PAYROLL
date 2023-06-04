const { body } = require("express-validator");
const GolonganServiceGet = require("./services/GolonganServiceGet");

const GolonganValidators = {
    ID_Golongan: (location = body, forCreate = true, field = "ID_Golongan") => {
        return location(field)
            .notEmpty()
            .withMessage("ID Golongan wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const golongan = await GolonganServiceGet("ID_golongan", value);

                if (forCreate && golongan) {
                    return Promise.reject("ID_Golongan sudah digunakan.");
                } else if (!forCreate && !golongan) {
                    return Promise.reject("ID_golongan tidak tersedia.");
                }

                return Promise.resolve(value);
            });
    },
    Nama_Golongan: (location = body, field = "Nama_Golongan") => {
        return location(field)
            .notEmpty()
            .withMessage("Nama_Golongan wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },
   Tunjangan_Golongan: (location = body, field = "Tunjangan_Golongan") => {
        return location(field)
            .notEmpty()
            .withMessage("Tunjangan golongan wajib diisi.")
            .bail()
            .isNumeric()
            .withMessage("Tunjangan golongan harus berupa angka.")
            .bail()
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Tunjangan golongan tidak boleh negatif.");
                }
                return true;
            });
    },

};

module.exports = GolonganValidators;
