const { body } = require("express-validator");
const JabatanServiceGet = require("./services/JabatanServiceGet");

const JabatanValidators = {
    ID_Jabatan: (location = body, forCreate = true, field = "ID_Jabatan") => {
        return location(field)
            .notEmpty()
            .withMessage("ID Jabatan wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const jabatan = await JabatanServiceGet("ID_jabatan", value);

                if (forCreate && jabatan) {
                    return Promise.reject("ID_Jabatan sudah digunakan.");
                } else if (!forCreate && !jabatan) {
                    return Promise.reject("ID_jabatan tidak tersedia.");
                }

                return Promise.resolve(value);
            });
    },
    Nama_Jabatan: (location = body, field = "Nama_Jabatan") => {
        return location(field)
            .notEmpty()
            .withMessage("Nama_Jabatan wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },
   Tunjangan_Jabatan: (location = body, field = "Tunjangan_Jabatan") => {
        return location(field)
            .notEmpty()
            .withMessage("Tunjangan jabatan wajib diisi.")
            .bail()
            .isNumeric()
            .withMessage("Tunjangan jabatan harus berupa angka.")
            .bail()
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Tunjangan jabatan tidak boleh negatif.");
                }
                return true;
            });
    },

};

module.exports = JabatanValidators;
