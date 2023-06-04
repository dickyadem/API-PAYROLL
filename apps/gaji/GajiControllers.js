const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiValidators = require("./GajiValidators");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const GajiServiceCreate = require("./services/GajiServiceCreate");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const { query, param } = require("express-validator");
const GajiServiceList = require("./services/GajiServiceList");
const GajiServiceGet = require("./services/GajiServiceGet");
const GajiServiceGetItemBeli = require("./services/GajiServiceGetItemBeli");
const PendapatanServiceGet = require("../Pendapatan/services/PendapatanServiceGet");
const GajiServiceID_GajiExcel = require("./services/GajiServiceID_GajiExcel");
const GajiServiceReportPeriod = require("./services/GajiServiceReportPeriod");
const GajiServiceReportPeriodExcel = require("./services/GajiServiceReportPeriodExcel");

const GajiControllers = require("express").Router();

GajiControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        GajiValidators.ID_Gaji(),
        GajiValidators.tanggal(),
        GajiValidators.total(),
        GajiValidators.kodePendapatan(),
        GajiValidators.dibayar(),
        GajiValidators.kembali(),
        GajiValidators.items.self(),
        GajiValidators.items.inner.kodePotongan(),
        GajiValidators.items.inner.namaPotongan(),
        GajiValidators.items.inner.hargaBeli(),
        GajiValidators.items.inner.jumlahBeli(),
        GajiValidators.items.inner.subtotal(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const Gaji = await GajiServiceCreate(
            req.body.ID_Gaji,
            req.body.tanggal,
            req.body.total,
            req.body.dibayar,
            req.body.kembali,
            req.body.kodePendapatan,
            req.body.items
        );
        res.status(201).json(Gaji);
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
        const items = await GajiServiceGetItemBeli(
            "ID_Gaji",
            req.params.ID_Gaji,
            true
        );

        return res.status(200).json({ ...Gaji, items });
    }
);

GajiControllers.post(
    "/:ID_Gaji/ID_Gaji-excel",
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

        const Pendapatan = await PendapatanServiceGet(
            "kodePendapatan",
            Gaji.kodePendapatan
        );
        const items = await GajiServiceGetItemBeli(
            "ID_Gaji",
            req.params.ID_Gaji,
            true
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `${req.params.ID_Gaji}-${new Date().getTime()}.xlsx`
        );

        const xlsx = await GajiServiceID_GajiExcel(Gaji, Pendapatan, items);
        await xlsx.write(res);
        return res.end();
    }
);

GajiControllers.post(
    "/report-period-excel",
    [
        UserServiceTokenAuthentication,
        GajiValidators.reporting.terms(),
        GajiValidators.reporting.startDate(),
        GajiValidators.reporting.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `Report Gaji - ${req.body.startDate} sd ${req.body.endDate}.xlsx`
        );

        const results = await GajiServiceReportPeriod(
            req.body.startDate,
            req.body.endDate,
            req.body.terms
        );

        const xlsx = await GajiServiceReportPeriodExcel(results);
        await xlsx.write(res);
        return res.end();
    }
);

module.exports = GajiControllers;
