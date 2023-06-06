const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiValidators = require("./GajiValidators");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const GajiServiceCreate = require("./services/GajiServicesCreate");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const { query, param } = require("express-validator");
const GajiServiceList = require("./services/GajiServicesList");
const GajiServiceGet = require("./services/GajiServicesGet");
const GajiServiceGetSlip = require("./services/GajiServicesGetSlip");
const GajiControllers = require("express").Router();


GajiControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        GajiValidators.ID_Gaji(),
        GajiValidators.Tanggal(),
        GajiValidators.ID_Karyawan(),
        GajiValidators.Total_Pendapatan(),
        GajiValidators.Total_Potongan(),
        GajiValidators.Gaji_Bersih(),
        GajiValidators.Keterangan(),
        GajiValidators.email(),
        GajiValidators.ID_Profil(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const Gaji = await GajiServiceCreate(
            req.body.ID_Gaji,
            req.body.Tanggal,
            req.body.ID_Karyawan,
            req.body.Total_Pendapatan,
            req.body.Total_Potongan,
            req.body.Gaji_Bersih,
            req.body.Keterangan,
            req.body.email,
            req.body.ID_Profil
        );
        res.status(201).json(Gaji);
        
    });

GajiControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorFields.page(),
        BaseValidatorFields.terms(query),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarGaji = await GajiServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarGaji);
    }
);

GajiControllers.get(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        GajiValidators.ID_Gaji(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const Gaji = await GajiServiceGet(
            "ID_Gaji",
            req.params.ID_Gaji,
            false
        );
        const items = await GajiServiceGetSlip(
            "ID_Gaji",
            req.params.ID_Gaji,
            true
        );

        return res.status(200).json({ ...Gaji, items });
    }
);


module.exports = GajiControllers;
