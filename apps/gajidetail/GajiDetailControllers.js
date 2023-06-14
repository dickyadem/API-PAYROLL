const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiDetailServiceGet = require("./services/GajiDetailServiceGet");
const GajiDetailServiceList = require("./services/GajiDetailServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const gajidetailServiceCreate = require("./services/GajiDetailServiceCreate");
const GajiDetailControllers = require("express").Router();


GajiDetailControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gajidetail = await gajidetailServiceCreate(
            req.body.ID_Gaji,
            req.body.ID_Pendapatan,
            req.body.Jumlah_Pendapatan,
            req.body.ID_Potongan,
            req.body.Jumlah_Potongan
        );
        return res.status(201).json(gajidetail);
    }
);

GajiDetailControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarGajiDetail = await GajiDetailServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarGajiDetail);
    }
);

GajiDetailControllers.get(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gajidetail = await GajiDetailServiceGet("ID_Gaji", req.params.ID_Gaji);
        return res.status(200).json(gajidetail);
    }
);





module.exports = GajiDetailControllers;
