const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiDetailServiceEdit = require("./services/GajiDetailServicesEdit");
const GajiDetailServiceGet = require("./services/GajiDetailServicesGet");
const GajiDetailServiceCreate = require("./services/GajiDetailServicesCreate");
const GajiDetailServiceList = require("./services/GajiDetailServicesList");
const GajiDetailServiceDelete = require("./services/GajiDetailServicesDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const GajiDetailValidators = require("./GajiDetailValidators");
const GajiDetailControllers = require("express").Router();

GajiDetailControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        GajiDetailValidators.ID_Gaji(),
        GajiDetailValidators.ID_Pendapatan(),
        GajiDetailValidators.Jumlah_Pendapatan(),
        GajiDetailValidators.ID_Potongan(),
        GajiDetailValidators.Jumlah_Potongan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gajidetail = await GajiDetailServiceCreate(
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
    "/:ID_GajiDetail",
    [
        UserServiceTokenAuthentication,
        GajiDetailValidators.ID_Gaji(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gajidetail = await GajiDetailServiceGet("ID_Gaji", req.params.ID_Gaji);
        return res.status(200).json(gajidetail);
    }
);

GajiDetailControllers.put(
    "/:ID_GajiDetail",
    [
        UserServiceTokenAuthentication,
        GajiDetailValidators.ID_Gaji(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gajidetail = await GajiDetailServiceEdit(
            req.params.ID_Gaji,
            req.body.Nama_GajiDetail,
        );
        return res.status(200).json(gajidetail);
    }
);

GajiDetailControllers.delete(
    "/:ID_GajiDetail",
    [
        UserServiceTokenAuthentication,
        GajiDetailValidators.ID_Gaji(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gajidetail = await GajiDetailServiceDelete(req.params.ID_Gaji);
        return res.status(204).json(gajidetail);
    }
);

module.exports = GajiDetailControllers;
