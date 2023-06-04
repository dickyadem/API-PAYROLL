const { body } = require("express-validator");
const PotonganServiceGet = require("./services/PotonganServiceGet");

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

};

module.exports = PotonganValidators;
