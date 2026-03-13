const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");

const ProfilServiceEdit = require("./services/ProfilServiceEdit");
const ProfilServiceGet = require("./services/ProfilServiceGet");
const ProfilServiceCreate = require("./services/ProfilServiceCreate");
const ProfilServiceList = require("./services/ProfilServiceList");
const ProfilServiceDelete = require("./services/ProfilServiceDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const ProfilValidators = require("./ProfilValidators");
const ProfilControllers = require("express").Router();

ProfilControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        ProfilValidators.ID_Profil(),
        ProfilValidators.Nama(),
        ProfilValidators.Alamat(),
        ProfilValidators.Telepon(),
        ProfilValidators.Fax(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const profil = await ProfilServiceCreate(
                req.body.ID_Profil,
                req.body.Nama,
                req.body.Alamat,
                req.body.Telepon,
                req.body.Fax,
                req.body.Email,
                req.body.Website
            );
            return res.status(201).json(profil);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

ProfilControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const daftarProfil = await ProfilServiceList(
                req.query.terms,
                req.query.page
            );
            return res.status(200).json(daftarProfil);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

ProfilControllers.get(
    "/:ID_Profil",
    [
        UserServiceTokenAuthentication,
        ProfilValidators.ID_Profil(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const profil = await ProfilServiceGet("ID_Profil", req.params.ID_Profil);
            return res.status(200).json(profil);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

ProfilControllers.put(
    "/:ID_Profil",
    [
        UserServiceTokenAuthentication,
        ProfilValidators.ID_Profil(param, false),
        ProfilValidators.Nama(),
        ProfilValidators.Alamat(),
        ProfilValidators.Telepon(),
        ProfilValidators.Fax(),
        ProfilValidators.Email(),
        ProfilValidators.Website(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const profil = await ProfilServiceEdit(
                req.params.ID_Profil,
                req.body.Nama,
                req.body.Alamat,
                req.body.Telepon,
                req.body.Fax,
                req.body.Email,
                req.body.Website,
            );
            return res.status(200).json(profil);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

ProfilControllers.delete(
    "/:ID_Profil",
    [
        UserServiceTokenAuthentication,
        ProfilValidators.ID_Profil(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            await ProfilServiceDelete(req.params.ID_Profil);
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

module.exports = ProfilControllers;
