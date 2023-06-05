const _ = require("lodash");
const { body } = require("express-validator");
const GajiServiceGet = require("./services/GajiServicesGet");
const PendapatanValidators = require("../pendapatan/PendapatanValidators");
const PotonganValidators = require("../potongan/PotonganValidators");
const UserValidators = require("../user/UserValidators");
const KaryawanValidators = require("../karyawan/KaryawanValidators");
const ProfilValidators = require("../profil/ProfilValidators");
const GajiDetailValidators = require("../gajidetail/GajiDetailValidators");

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
    ID_User: (location = body, field = "ID_User") => {
        return UserValidators.ID_User(location, false, field);
    },
    ID_Profil: (location = body, field = "ID_Profil") => {
        return ProfilValidators.ID_Profil(location, false, field);
    },
    items: {
        self: (location = body, field = "items") => {
            return location(field)
                .notEmpty()
                .withMessage("Pilihan wajib diisi.")
                .bail()
                .isArray({ min: 1 })
                .withMessage("Item harus berupa array dan minimal 1 list di dalamnya.");
        },
        inner: {
            ID_Pendapatan: (location = body, field = "items.*.ID_Pendapatan") => {
                return PendapatanValidators.ID_Pendapatan(location, false, field)
                    .notEmpty()
                    .withMessage("ID Pendapatan wajib diisi.");
            },
            Nama_Pendapatan: (location = body, field = "items.*.Nama_Pendapatan") => {
                return PendapatanValidators.Nama_Pendapatan(location, false, field)
                    .notEmpty()
                    .withMessage("Nama Pendapatan wajib diisi.");
            },
            Jumlah_Pendapatan: (location = body, field = "items.*.Jumlah_Pendapatan") => {
                return GajiDetailValidators.Jumlah_Pendapatan(location, false, field)
                    .notEmpty()
                    .withMessage("Jumlah Pendapatan wajib diisi.");
            },
            ID_Potongan: (location = body, field = "items.*.ID_Potongan") => {
                return PotonganValidators.ID_Potongan(location, false, field)
                    .notEmpty()
                    .withMessage("ID Potongan wajib diisi.");
            },
            Nama_Potongan: (location = body, field = "items.*.Nama_Potongan") => {
                return PotonganValidators.Nama_Potongan(location, false, field)
                    .notEmpty()
                    .withMessage("Nama Potongan wajib diisi.");
            },
            Jumlah_Potongan: (location = body, field = "items.*.Jumlah_Potongan") => {
                return GajiDetailValidators.Jumlah_Potongan(location, false, field)
                    .notEmpty()
                    .withMessage("Jumlah Potongan wajib diisi.");
            },
        },
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
            .bail()
            .custom(async (value, { req, location, path }) => {
                const index = _.toPath(path)[1];
                const totalPendapatan = req[location].items[index].Total_Pendapatan;
                const totalPotongan = req[location].items[index].Total_Potongan;
                const gajiBersih = totalPendapatan - totalPotongan;

                if (value != gajiBersih) {
                    return Promise.reject("Gaji Bersih tidak valid.");
                }

                return Promise.resolve(true);
            });
    },
    Total_Potongan: (location = body, field = "Total_Potongan") => {
        return location(field)
            .custom(async (value, { req, location }) => {
                const items = req[location].items;
                let totalPotongan = 0;

                for (const item of items) {
                    const jumlahPotongan = item.Jumlah_Potongan;
                    totalPotongan += jumlahPotongan;
                }

                if (value != totalPotongan) {
                    return Promise.reject("Total Potongan tidak valid.");
                }

                return Promise.resolve(true);
            });
    },
    Total_Pendapatan: (location = body, field = "Total_Pendapatan") => {
        return location(field)
            .custom(async (value, { req, location }) => {
                const items = req[location].items;
                let totalPendapatan = 0;

                for (const item of items) {
                    const jumlahPendapatan = item.Jumlah_Pendapatan;
                    totalPendapatan += jumlahPendapatan;
                }

                if (value != totalPendapatan) {
                    return Promise.reject("Total Pendapatan tidak valid.");
                }

                return Promise.resolve(true);
            });
    },

};

module.exports = GajiValidators;
