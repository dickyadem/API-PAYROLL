const { body } = require("express-validator");
const PotonganServiceGet = require("./services/PotonganServiceGet");
const JabatanValidators = require("../jabatan/JabatanValidators");

const PotonganValidators = {
    ID_Potongan: (location = body, forCreate = true, field = "ID_Potongan") => {
        return location(field)
            .notEmpty()
            .withMessage("ID Potongan wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const potongan = await PotonganServiceGet("ID_potongan", value);

                if (forCreate && potongan) {
                    return Promise.reject("ID_Potongan sudah digunakan.");
                } else if (!forCreate && !potongan) {
                    return Promise.reject("ID_potongan tidak tersedia.");
                }

                return Promise.resolve(value);
            });
    },
    Nama_Potongan: (location = body, field = "Nama_Potongan") => {
        return location(field)
            .notEmpty()
            .withMessage("Nama_Potongan wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },
    Nominal: (location = body, field = "Nominal") => {
        return location(field)
            .notEmpty()
            .withMessage("Nominal wajib diisi.")
            .bail()
            .isNumeric()
            .withMessage("Nominal harus berupa angka.")
            .bail()
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Nominal tidak boleh negatif.");
                }
                return true;
            });
    },
    ID_Jabatan: (location = body, field = "ID_Jabatan") => {
        return location(field)
            .optional({ nullable: true })
            .trim();
    },
    Keterangan: (location = body, field = "Keterangan") => {
        return location(field)
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ max: 255 })
            .withMessage("Keterangan maksimal 255 karakter.");
    },

};

module.exports = PotonganValidators;
