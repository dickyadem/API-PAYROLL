const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");

const GolonganServiceEdit = require("./services/GolonganServiceEdit");
const GolonganServiceGet = require("./services/GolonganServiceGet");
const GolonganServiceCreate = require("./services/GolonganServiceCreate");
const GolonganServiceList = require("./services/GolonganServiceList");
const GolonganServiceDelete = require("./services/GolonganServiceDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const GolonganValidators = require("./GolonganValidators");
const GolonganControllers = require("express").Router();

GolonganControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        GolonganValidators.ID_Golongan(),
        GolonganValidators.Nama_Golongan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const golongan = await GolonganServiceCreate(
            req.body.ID_Golongan,
            req.body.Nama_Golongan,
        );
        return res.status(201).json(golongan);
    }
);

GolonganControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarGolongan = await GolonganServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarGolongan);
    }
);

GolonganControllers.get(
    "/:ID_Golongan",
    [
        UserServiceTokenAuthentication,
        GolonganValidators.ID_Golongan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const golongan = await GolonganServiceGet("ID_Golongan", req.params.ID_Golongan);
        return res.status(200).json(golongan);
    }
);

GolonganControllers.put(
    "/:ID_Golongan",
    [
        UserServiceTokenAuthentication,
        GolonganValidators.ID_Golongan(param, false),
        GolonganValidators.Nama_Golongan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const golongan = await GolonganServiceEdit(
            req.params.ID_Golongan,
            req.body.Nama_Golongan,
        );
        return res.status(200).json(golongan);
    }
);

GolonganControllers.delete(
    "/:ID_Golongan",
    [
        UserServiceTokenAuthentication,
        GolonganValidators.ID_Golongan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const golongan = await GolonganServiceDelete(req.params.ID_Golongan);
        return res.status(204).json(golongan);
    }
);

module.exports = GolonganControllers;
