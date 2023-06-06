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
        // UserServiceTokenAuthentication,
        ProfilValidators.ID_Profil(),
        ProfilValidators.Nama(),
        ProfilValidators.Alamat(),
        ProfilValidators.Telepon(),
        ProfilValidators.Fax(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
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
        const daftarProfil = await ProfilServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarProfil);
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
        const profil = await ProfilServiceGet("ID_Profil", req.params.ID_Profil);
        return res.status(200).json(profil);
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
        const profil = await ProfilServiceDelete(req.params.ID_Profil);
        return res.status(204).json(profil);
    }
);

module.exports = ProfilControllers;
