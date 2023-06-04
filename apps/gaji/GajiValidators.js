const _ = require("lodash");
const { body } = require("express-validator");
const GajiServiceGet = require("./services/GajiServiceGet");
const BarangServiceGet = require("../barang/services/BarangServiceGet");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const BaseValidatorHandleUndefined = require("../base/validators/BaseValidatorHandleUndefined");
const PemasokValidators = require("../pemasok/PemasokValidators");
const BarangValidators = require("../barang/BarangValidators");

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
    tanggal: (location = body, field = "tanggal") => {
        return location(field)
            .notEmpty()
            .withMessage("Tanggal transaksi wajib")
            .bail()
            .trim();
    },
    kodePemasok: (location = body, field = "kodePemasok") => {
        return PemasokValidators.kodePemasok(location, false, field);
    },
    dibayar: (location = body, field = "dibayar") => {
        return location(field)
            .notEmpty()
            .withMessage("Dibayar wajib.")
            .bail()
            .isInt()
            .withMessage("Dibayar harus angka.")
            .bail()
            .customSanitizer((value) => parseInt(value))
            .custom((value, { req }) => {
                if (value < req.body.total) {
                    throw new Error("Uang dibayar kurang.");
                }
                return true;
            });
    },
    kembali: (location = body, field = "kembali") => {
        return location(field)
            .notEmpty()
            .withMessage("Kembali wajib.")
            .bail()
            .isInt()
            .withMessage("Total harus angka.")
            .bail()
            .customSanitizer((value) => parseInt(value))
            .custom((value, { req }) => {
                const calculateKembali = req.body.dibayar - req.body.total;
                if (calculateKembali < 0) {
                    throw new Error("Uang kembalian tidak boleh minus.");
                } else if (calculateKembali !== value) {
                    throw new Error("Uang kembalian tidak valid.");
                }

                return true;
            });
    },
    // items: {
    //     self: (location = body, field = "items") => {
    //         return location(field)
    //             .notEmpty()
    //             .withMessage("Item Gaji wajib.")
    //             .bail()
    //             .isArray({ min: 1 })
    //             .withMessage(
    //                 "Item harus berupa array dan minimal 1 barang di dalamnya."
    //             );
    //     },
    //     inner: {
    //         kodeBarang: (location = body, field = "items.*.kodeBarang") => {
    //             return BarangValidators.kodeBarang(location, false, field);
    //         },
    //         namaBarang: (location = body, field = "items.*.namaBarang") => {
    //             return BarangValidators.namaBarang(location, field)
    //                 .bail()
    //                 .custom(async (value, { req, location, path }) => {
    //                     const index = _.toPath(path)[1];
    //                     const barang = await BarangServiceGet(
    //                         "kodeBarang",
    //                         req[location].items[index].kodeBarang
    //                     );

    //                     BaseValidatorHandleUndefined(barang, "Kode Barang");

    //                     if (barang.namaBarang !== value) {
    //                         throw new Error(
    //                             "Nama barang tidak sama dengan nama barang aslinya."
    //                         );
    //                     }
    //                 });
    //         },
    //         hargaBeli: (location = body, field = "items.*.hargaBeli") => {
    //             return BarangValidators.hargaBeli(location, field)
    //                 .bail()
    //                 .custom(async (value, { req, location, path }) => {
    //                     const index = _.toPath(path)[1];
    //                     const barang = await BarangServiceGet(
    //                         "kodeBarang",
    //                         req[location].items[index].kodeBarang
    //                     );

    //                     BaseValidatorHandleUndefined(barang, "Kode Barang");

    //                     if (barang.hargaBeli !== value) {
    //                         return Promise.reject(
    //                             "Harga beli barang tidak sama dengan harga beli aslinya."
    //                         );
    //                     }

    //                     return Promise.resolve(true);
    //                 });
    //         },
    //         jumlahBeli: (location = body, field = "items.*.jumlahBeli") => {
    //             return location(field)
    //                 .notEmpty()
    //                 .withMessage("Jumlah beli wajib.")
    //                 .bail()
    //                 .isInt()
    //                 .withMessage("Jumlah beli harus angka.")
    //                 .bail()
    //                 .customSanitizer((value) => parseInt(value))
    //                 .custom((value) => {
    //                     if (value <= 0) {
    //                         throw new Error("Jumlah beli tidak boleh 0");
    //                     }
    //                     return true;
    //                 });
    //         },
    //         subtotal: (location = body, field = "items.*.subtotal") => {
    //             return location(field)
    //                 .notEmpty()
    //                 .withMessage("Subtotal wajib.")
    //                 .bail()
    //                 .customSanitizer((value) => parseInt(value))
    //                 .custom((value) => {
    //                     if (value <= 0) {
    //                         throw new Error("Nilai subtotal tidak boleh 0 atau dibawahnya.");
    //                     }
    //                     return true;
    //                 })
    //                 .bail()
    //                 .custom(async (value, { req, location, path }) => {
    //                     const index = _.toPath(path)[1];
    //                     const barang = await BarangServiceGet(
    //                         "kodeBarang",
    //                         req[location].items[index].kodeBarang
    //                     );

    //                     BaseValidatorHandleUndefined(barang, "Kode Barang");

    //                     const calculateSubtotal =
    //                         barang.hargaBeli * req[location].items[index].jumlahBeli;
    //                     if (calculateSubtotal !== value) {
    //                         return Promise.reject("Subtotal tidak valid.");
    //                     }

    //                     return Promise.resolve(true);
    //                 });
    //         },
    //     },
    // },
    // total: (location = body, field = "total") => {
    //     return location(field)
    //         .notEmpty()
    //         .withMessage("Jumlah beli wajib.")
    //         .bail()
    //         .isInt()
    //         .withMessage("Total harus angka.")
    //         .bail()
    //         .customSanitizer((value) => parseInt(value))
    //         .custom((value) => {
    //             if (value <= 0) {
    //                 throw new Error("Total tidak boleh bernilai 0 atau di bawahnya.");
    //             }
    //             return true;
    //         })
    //         .custom((value, { req }) => {
    //             let total = 0;
    //             for (const item of req.body.items) {
    //                 total = total + item.subtotal;
    //             }

    //             if (total !== value) {
    //                 throw new Error("Total tidak valid.");
    //             }

    //             return true;
    //         });
    // },
    // reporting: {
    //     terms: (location = body, field = "terms") => {
    //         return BaseValidatorFields.terms(location, field);
    //     },
    //     startDate: (location = body, field = "startDate") => {
    //         return location(field)
    //             .notEmpty()
    //             .withMessage("Start date wajib diisi.")
    //             .bail()
    //             .isDate()
    //             .withMessage("Start date tidak valid.");
    //     },
    //     endDate: (location = body, field = "endDate") => {
    //         return location(field)
    //             .notEmpty()
    //             .withMessage("End date wajib diisi.")
    //             .bail()
    //             .isDate()
    //             .withMessage("End date tidak valid.");
    //     },
    // },
};

module.exports = GajiValidators;
