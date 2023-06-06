const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");

const PotonganServiceEdit = require("./services/PotonganServiceEdit");
const PotonganServiceGet = require("./services/PotonganServiceGet");
const PotonganServiceCreate = require("./services/PotonganServiceCreate");
const PotonganServiceList = require("./services/PotonganServiceList");
const PotonganServiceDelete = require("./services/PotonganServiceDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const PotonganValidators = require("./PotonganValidators");
const PotonganControllers = require("express").Router();

PotonganControllers.post(
    "/",
    [
        // UserServiceTokenAuthentication,
        PotonganValidators.ID_Potongan(),
        PotonganValidators.Nama_Potongan(),
    ],
    async (req, res) => {
        const potongan = await PotonganServiceCreate(
            req.body.ID_Potongan,
            req.body.Nama_Potongan,
        );
        return res.status(201).json(potongan);
    }
);

PotonganControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarPotongan = await PotonganServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarPotongan);
    }
);

PotonganControllers.get(
    "/:ID_Potongan",
    [
        UserServiceTokenAuthentication,
        PotonganValidators.ID_Potongan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongan = await PotonganServiceGet("ID_Potongan", req.params.ID_Potongan);
        return res.status(200).json(potongan);
    }
);

PotonganControllers.put(
    "/:ID_Potongan",
    [
        UserServiceTokenAuthentication,
        PotonganValidators.ID_Potongan(param, false),
        PotonganValidators.Nama_Potongan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongan = await PotonganServiceEdit(
            req.params.ID_Potongan,
            req.body.Nama_Potongan,
        );
        return res.status(200).json(potongan);
    }
);

PotonganControllers.delete(
    "/:ID_Potongan",
    [
        UserServiceTokenAuthentication,
        PotonganValidators.ID_Potongan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongan = await PotonganServiceDelete(req.params.ID_Potongan);
        return res.status(204).json(potongan);
    }
);

module.exports = PotonganControllers;
