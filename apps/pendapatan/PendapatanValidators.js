const { body } = require("express-validator");
const PendapatanServiceGet = require("./services/PendapatanServiceGet");

const PendapatanValidators = {
    ID_Pendapatan: (location = body, forCreate = true, field = "ID_Pendapatan") => {
        return location(field)
            .notEmpty()
            .withMessage("ID Pendapatan wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const pendapatan = await PendapatanServiceGet("ID_pendapatan", value);

                if (forCreate && pendapatan) {
                    return Promise.reject("ID_Pendapatan sudah digunakan.");
                } else if (!forCreate && !pendapatan) {
                    return Promise.reject("ID_pendapatan tidak tersedia.");
                }

                return Promise.resolve(value);
            });
    },
    Nama_Pendapatan: (location = body, field = "Nama_Pendapatan") => {
        return location(field)
            .notEmpty()
            .withMessage("Nama_Pendapatan wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },

};

module.exports = PendapatanValidators;
