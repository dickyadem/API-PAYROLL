const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const PendapatanDetailServiceGet = require("./services/PendapatanDetailServiceGet");
const PendapatanDetailServiceList = require("./services/PendapatanDetailServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const PendapatanDetailServiceCreate = require("./services/PendapatanDetailServiceCreate");
const PendapatanDetailControllers = require("express").Router();


PendapatanDetailControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const pendapatandetail = await PendapatanDetailServiceCreate(
            req.body.ID_Gaji,
            req.body.ID_Pendapatan,
            req.body.Jumlah_Pendapatan
        );
        return res.status(201).json(pendapatandetail);
    }
);

PendapatanDetailControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarPendapatanDetail = await PendapatanDetailServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarPendapatanDetail);
    }
);

PendapatanDetailControllers.get(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const pendapatandetail = await PendapatanDetailServiceGet("ID_Gaji", req.params.ID_Gaji);
        return res.status(200).json(pendapatandetail);
    }
);





module.exports = PendapatanDetailControllers;
