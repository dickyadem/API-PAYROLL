const { body } = require("express-validator");
const KaryawanServiceGet = require("./services/KaryawanServiceGet");
const GolonganValidators = require("../golongan/GolonganValidators");
const JabatanValidators = require("../jabatan/JabatanValidators");

const KaryawanValidators = {
    ID_Karyawan: (location = body, forCreate = true, field = "ID_Karyawan") => {
        return location(field)
            .notEmpty()
            .withMessage("ID Karyawan wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const karyawan = await KaryawanServiceGet("ID_karyawan", value);

                if (forCreate && karyawan) {
                    return Promise.reject("ID_Karyawan sudah digunakan.");
                } else if (!forCreate && !karyawan) {
                    return Promise.reject("ID_karyawan tidak tersedia.");
                }

                return Promise.resolve(value);
            });
    },
    Nama_Karyawan: (location = body, field = "Nama_Karyawan") => {
        return location(field)
            .notEmpty()
            .withMessage("Nama_Karyawan wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },

    Gaji_Pokok: (location = body, field = "Gaji_Pokok ") => {
        return location(field)
            .notEmpty()
            .withMessage("Gaji Pokok wajib diisi.")
            .bail()
            .isNumeric()
            .withMessage("Gaji Pokok harus berupa angka.")
            .bail()
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Gaji Pokok tidak boleh negatif.");
                }
                return true;
            });
    },
    ID_Golongan: (location = body, field = "ID_Golongan") => {
        return GolonganValidators.ID_Golongan(location, false, field);
    },
    ID_Jabatan: (location = body, field = "ID_Jabatan") => {
        return JabatanValidators.ID_Jabatan(location, false, field);
    },
    Divisi: (location = body, field = "Divisi") => {
        return location(field)
            .notEmpty()
            .withMessage("Divisi wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },
    Status_Pernikahan: (location = body, field = "Status_Pernikahan") => {
        return location(field)
            .notEmpty()
            .withMessage("Status Pernikahan wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },
    Jumlah_Anak: (location = body, field = "Jumlah_Anak") => {
        return location(field)
            .notEmpty()
            .withMessage("Jumlah Anak wajib diisi.")
            .bail()
            .isNumeric()
            .withMessage("Jumlah Anak harus berupa angka.")
            .bail()
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Jumlah Anak tidak boleh negatif.");
                }
                return true;
            });
    },
    

};

module.exports = KaryawanValidators;
