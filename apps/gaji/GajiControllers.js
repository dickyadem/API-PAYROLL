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
        GajiValidators.items.self(),
        GajiValidators.items.inner.ID_Potongan(),
        GajiValidators.items.inner.Jumlah_Potongan(),
        GajiValidators.items.inner.ID_Pendapatan(),
        GajiValidators.items.inner.Jumlah_Pendapatan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const Gaji = await GajiServiceCreate(
                req.body.ID_Gaji,
                req.body.Tanggal,
                req.body.ID_Karyawan,
                req.body.Total_Pendapatan,
                req.body.Total_Potongan,
                req.body.Gaji_Bersih,
                req.body.Keterangan,
                req.body.email,
                req.body.ID_Profil,
                req.body.items
            );
            
            res.status(201).json(Gaji);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

GajiControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorFields.page(),
        BaseValidatorFields.terms(query),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const daftarGaji = await GajiServiceList(req.query.terms, req.query.page);
            res.status(200).json(daftarGaji);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
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
        try {
            const Gaji = await GajiServiceGet("ID_Gaji", req.params.ID_Gaji, false);
            const items = await GajiServiceGetSlip(
                "ID_Gaji",
                req.params.ID_Gaji,
                true
            );
            res.status(200).json({ ...Gaji, items });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

module.exports = GajiControllers;
