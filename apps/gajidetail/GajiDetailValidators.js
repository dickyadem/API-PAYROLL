const { body } = require("express-validator");
const GajiDetailServiceGet = require("./services/GajiDetailServicesGet");
const GajiValidators = require("../gaji/GajiValidators");
const PendapatanValidators = require("../pendapatan/PendapatanValidators");
const PotonganValidators = require("../potongan/PotonganValidators");


const GajiDetailValidators = {
    ID_Gaji: (location = body, field = "ID_Gaji") => {
        return GajiValidators.ID_Gaji(location, false, field);
    },
    
    
    ID_Pendapatan: (location = body, field = "ID_Pendapatan") => {
        return PendapatanValidators.ID_Pendapatan(location, false, field);
    },
    
    ID_Potongan: (location = body, field = "ID_Potongan") => {
        return PotonganValidators.ID_Potongan(location, false, field);
    },
    Jumlah_Potongan: (location = body, field = "Jumlah_Potongan") => {
        return location(field)
            .notEmpty()
            .withMessage("Jumlah Potongan wajib diisi.")
            .bail()
            .isNumeric()
            .withMessage("Jumlah Potongan harus berupa angka.")
            .bail()
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Jumlah Potongan tidak boleh negatif.");
                }
                return true;
            });
    },
    Jumlah_Pendapatan: (location = body, field = "Jumlah_Pendapatan") => {
        return location(field)
        .notEmpty()
        .withMessage("Jumlah Pendapatan wajib diisi.")
        .bail()
        // .isNumeric()
        // .withMessage("Jumlah Pendapatan harus berupa angka.")
        // .bail()
        // .custom((value) => {
        //     if (value < 0) {
        //     throw new Error("Jumlah Pendapatan tidak boleh negatif.");
        //     }
        //     return true;
        // });
  },
};

module.exports = GajiDetailValidators;
