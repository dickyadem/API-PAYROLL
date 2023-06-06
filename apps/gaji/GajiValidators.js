const _ = require("lodash");
const { body } = require("express-validator");
const GajiServiceGet = require("./services/GajiServicesGet");
const PendapatanValidators = require("../pendapatan/PendapatanValidators");
const PotonganValidators = require("../potongan/PotonganValidators");
const UserValidators = require("../user/UserValidators");
const KaryawanValidators = require("../karyawan/KaryawanValidators");
const ProfilValidators = require("../profil/ProfilValidators");
const GajiDetailValidators = require("../gajidetail/GajiDetailValidators")

const GajiValidators = {
    ID_Gaji: (location = body, forCreate = true, field = "ID_Gaji") => {
        return location(field)
            .notEmpty()
            .withMessage("ID_Gaji wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const Gaji = await GajiServiceGet("ID_Gaji", value);
                if (forCreate && Gaji) {
                    return Promise.reject("ID_Gaji Gaji sudah pernah dibuat.");
                } else if (!forCreate && !Gaji) {
                    return Promise.reject("ID_Gaji Gaji tidak ada.");
                }

                return Promise.resolve(true);
            });
    },
    Tanggal: (location = body, field = "Tanggal") => {
        return location(field)
            .notEmpty()
            .withMessage("Tanggal transaksi wajib")
            .bail()
            .trim();
    },
    ID_Karyawan: (location = body, field = "ID_Karyawan") => {
        return KaryawanValidators.ID_Karyawan(location, false, field);
    },
    email: (location = body, field = "email") => {
        return UserValidators.email(location, false, field);
    },
    ID_Profil: (location = body, field = "ID_Profil") => {
        return ProfilValidators.ID_Profil(location, false, field);
    },
    ID_Pendapatan: (location = body, field = "ID_Pendapatan") => {
        return PendapatanValidators.ID_Pendapatan(location, false, field);
    },
    ID_Potongan: (location = body, field = "ID_Potongan") => {
        return PotonganValidators.ID_Potongan(location, false, field);
    },
    Jumlah_Pendapatan: (location = body, field = "Jumlah_Pendapatan") => {
        return GajiDetailValidators.Jumlah_Pendapatan(location, false, field);
    },
    Jumlah_Potongan: (location = body, field = "Jumlah_Potongan") => {
        return GajiDetailValidators.Jumlah_Potongan(location, false, field);
    },
    Keterangan: (location = body, field = "Keterangan") => {
        return location(field)
            .notEmpty()
            .withMessage("Keterangan wajib diisi.")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },

    Gaji_Bersih: (location = body, field = "Gaji_Bersih") => {
        return location(field)
            .notEmpty()
            .withMessage("Gaji Bersih wajib diisi.")
            .bail()
            .isInt()
            .withMessage("Gaji Bersih harus berupa angka.")
        
    },
    Total_Potongan: (location = body, field = "Total_Potongan") => {
        return location(field)
    },
    Total_Pendapatan: (location = body, field = "Total_Pendapatan") => {
        return location(field)
    },

};

module.exports = GajiValidators;
