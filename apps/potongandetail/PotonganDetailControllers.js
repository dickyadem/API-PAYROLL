const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const PotonganDetailServiceGet = require("./services/PotonganDetailServiceGet");
const PotonganDetailServiceList = require("./services/PotonganDetailServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const PotonganDetailServiceCreate = require("./services/PotonganDetailServiceCreate");
const PotonganDetailControllers = require("express").Router();


PotonganDetailControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongandetail = await PotonganDetailServiceCreate(
            req.body.ID_Gaji,
            req.body.ID_Potongan,
            req.body.Jumlah_Potongan
        );
        return res.status(201).json(potongandetail);
    }
);

PotonganDetailControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarPotonganDetail = await PotonganDetailServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarPotonganDetail);
    }
);

PotonganDetailControllers.get(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongandetail = await PotonganDetailServiceGet("ID_Gaji", req.params.ID_Gaji);
        return res.status(200).json(potongandetail);
    }
);





module.exports = PotonganDetailControllers;
