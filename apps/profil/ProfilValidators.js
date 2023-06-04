const { body } = require("express-validator");
const ProfilServiceGet = require("./services/ProfilServiceGet");

const ProfilValidators = {
    ID_Profil: (location = body, forCreate = true, field = "ID_Profil") => {
        return location(field)
            .notEmpty()
            .withMessage("ID Profil wajib diisi.")
            .bail()
            .trim()
            .custom(async (value) => {
                const profil = await ProfilServiceGet("ID_profil", value);

                if (forCreate && profil) {
                    return Promise.reject("ID_Profil sudah digunakan.");
                } else if (!forCreate && !profil) {
                    return Promise.reject("ID_profil tidak tersedia.");
                }

                return Promise.resolve(value);
            });
    },
    Nama: (location = body, field = "Nama") => {
        return location(field)
            .notEmpty()
            .withMessage("Nama wajib diisi")
            .bail()
            .trim()
            .customSanitizer((value) =>
                value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
            );
    },
    Alamat: (location = body, field = "Alamat") => {
        return location(field)
            .notEmpty()
            .withMessage("Alamat  kosong.")
            .bail()
            .trim()
            .isLength({
                min: 10,
            })
            .withMessage("Alamat  kurang dari 10 karakter.");
    },
    Telepon: (location = body, field = "Telepon") => {
        return location(field)
            .notEmpty()
            .withMessage("Telepon  kosong.")
            .bail()
            .trim()
            .isLength({
                min: 10,
                max: 13,
            })
            .withMessage(
                "Telepon  kurang dari 10 atau lebih dari 13 nomor karakter."
            );
    },
    Fax: (location = body, field = "Fax") => {
        return location(field)
            .notEmpty()
            .withMessage("Nomor Fax wajib diisi.")
            .bail()
            .custom((value) => {
                if (!/^[\d\s-]+$/.test(value)) {
                    throw new Error("Nomor Fax hanya boleh terdiri dari angka, spasi, dan tanda minus.");
                }
                return true;
            })
            .bail()
            .custom((value) => {
                if (value.length < 10 || value.length > 15) {
                    throw new Error("Nomor Fax harus memiliki panjang antara 10 hingga 15 karakter.");
                }
                return true;
            });
    },
   Email: (location = body, forCreate = true, field = "email") => {
        return location(field)
            .notEmpty()
            .withMessage("Email wajib diisi.")
            .bail()
            .trim()
            .isEmail()
            .withMessage("Email tidak valid.")
            .bail()
            .custom(async (value) => {
                const user = await UserServiceIsEmailExist(value);
                if (forCreate && user) {
                    return Promise.reject("Email sudah terdaftar.");
                } else if (!forCreate && !user) {
                    return Promise.reject("User tidak tersedia.");
                }

                return Promise.resolve(true);
            });
    },
  Website: (location = body, field = "website") => {
        return location(field)
            .notEmpty()
            .withMessage("Website wajib diisi.")
            .bail()
            .isURL()
            .withMessage("Website harus berupa URL yang valid.")
            .bail()
            .custom((value) => {
                if (value.length > 100) {
                    throw new Error("Website maksimal memiliki panjang 100 karakter.");
                }
                return true;
            });
    },
};

module.exports = ProfilValidators;
