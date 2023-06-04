const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiValidators = require("./GajiValidators");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const GajiServiceCreate = require("./services/GajiServiceCreate");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const { query, param } = require("express-validator");
const GajiServiceList = require("./services/GajiServiceList");
const GajiServiceGet = require("./services/GajiServiceGet");
const GajiServiceGetItemBeli = require("./services/GajiServiceGetItemBeli");
const PemasokServiceGet = require("../pemasok/services/PemasokServiceGet");
const GajiServiceFakturExcel = require("./services/GajiServiceFakturExcel");
const GajiServiceReportPeriod = require("./services/GajiServiceReportPeriod");
const GajiServiceReportPeriodExcel = require("./services/GajiServiceReportPeriodExcel");

const GajiControllers = require("express").Router();

GajiControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        GajiValidators.faktur(),
        GajiValidators.tanggal(),
        GajiValidators.total(),
        GajiValidators.kodePemasok(),
        GajiValidators.dibayar(),
        GajiValidators.kembali(),
        GajiValidators.items.self(),
        GajiValidators.items.inner.kodeBarang(),
        GajiValidators.items.inner.namaBarang(),
        GajiValidators.items.inner.hargaBeli(),
        GajiValidators.items.inner.jumlahBeli(),
        GajiValidators.items.inner.subtotal(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const Gaji = await GajiServiceCreate(
            req.body.faktur,
            req.body.tanggal,
            req.body.total,
            req.body.dibayar,
            req.body.kembali,
            req.body.kodePemasok,
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
    "/:faktur",
    [
        UserServiceTokenAuthentication,
        GajiValidators.faktur(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const Gaji = await GajiServiceGet(
            "faktur",
            req.params.faktur,
            false
        );
        const items = await GajiServiceGetItemBeli(
            "faktur",
            req.params.faktur,
            true
        );

        return res.status(200).json({ ...Gaji, items });
    }
);

GajiControllers.post(
    "/:faktur/faktur-excel",
    [
        UserServiceTokenAuthentication,
        GajiValidators.faktur(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const Gaji = await GajiServiceGet(
            "faktur",
            req.params.faktur,
            false
        );

        const pemasok = await PemasokServiceGet(
            "kodePemasok",
            Gaji.kodePemasok
        );
        const items = await GajiServiceGetItemBeli(
            "faktur",
            req.params.faktur,
            true
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `${req.params.faktur}-${new Date().getTime()}.xlsx`
        );

        const xlsx = await GajiServiceFakturExcel(Gaji, pemasok, items);
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
