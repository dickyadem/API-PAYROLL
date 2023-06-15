const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiValidators = require("./GajiValidators");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const GajiServiceCreate = require("./services/GajiServicesCreate");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const { query, param } = require("express-validator");
const GajiServiceList = require("./services/GajiServicesList");
const GajiServiceGet = require("./services/GajiServicesGet");
const GajiControllers = require("express").Router();
const ConfigCTA = require("../base/services/ConfigCTA");
const GajiServiceReportPeriodExcel = require("./services/GajiServiceReportPeriodExcel");
const GajiServiceReportPeriod = require("./services/GajiServiceReportPeriod");
const GajiServiceFakturExcel = require("./services/GajiServiceFakturExcel");
const GajiServiceGetSlip = require("./services/GajiServicesGetSlip");
const message = ConfigCTA.CTA_MESSAGE_SUCCESS_CREATE;
const PphServiceGetSlip = require("../gaji/laporanPPH/PphServiceGetSlip");
const PphServiceFakturExcel = require("../gaji/laporanPPH/PphServiceFakturExcel");
const PphServiceReportPeriodExcel = require("../gaji/laporanPPH/PphServiceReportPeriodExcel");
const PphServiceReportPeriod = require("../gaji/laporanPPH/PphServiceReportPeriod");
const BPJSServiceGetSlip = require("../gaji/laporanBPJS/BPJSServiceGetSlip");
const BPJSServiceFakturExcel = require("../gaji/laporanBPJS/BPJSServiceFakturExcel");
const BPJSServiceReportPeriodExcel = require("../gaji/laporanBPJS/BPJSServiceReportPeriodExcel");
const BPJSServiceReportPeriod = require("../gaji/laporanBPJS/BPJSServiceReportPeriod");
const createPayslipExcel = require("../gaji/laporanslip/SlipServiceFakturExcel");

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

            res.status(201).json({ Gaji, message });
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
GajiControllers.post(
    "/gaji-excel",
    [
        UserServiceTokenAuthentication,
        // GajiValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const gaji = await GajiServiceGetSlip("ID_Gaji", req.params.ID_Gaji, false);
        const items = await GajiServiceGetSlip("ID_Gaji", req.params.ID_Gaji, true);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="gaji-${new Date().getTime()}.xlsx"`
        );

        const xlsx = await GajiServiceFakturExcel();
        await xlsx.write(res);
        return res.end();

    }
);

GajiControllers.post(
    "/report-period-excel",
    [
        UserServiceTokenAuthentication,
        // GajiValidators.reporting.terms(),
        // GajiValidators.reporting.startDate(),
        // GajiValidators.reporting.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Report Gaji - ${req.body.startDate} sd ${req.body.endDate}.xlsx"`
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
GajiControllers.post(
    "/pph-excel",
    [
        UserServiceTokenAuthentication,
        // PphValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const pph = await PphServiceGetSlip("ID_Gaji", req.params.ID_Gaji, false);
        const items = await PphServiceGetSlip("ID_Gaji", req.params.ID_Gaji, true);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="pph-${new Date().getTime()}.xlsx"`
        );

        const xlsx = await PphServiceFakturExcel(); // Inisialisasi objek xlsx
        await xlsx.write(res);
        return res.end();
    }
);

GajiControllers.post(
    "/reportPph-period-excel",
    [
        UserServiceTokenAuthentication,
        // PphValidators.reportPphing.terms(),
        // PphValidators.reportPphing.startDate(),
        // PphValidators.reportPphing.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Report Potongan PPH - ${req.body.startDate} sd ${req.body.endDate}.xlsx"`
        );

        const results = await PphServiceReportPeriod(
            req.body.startDate,
            req.body.endDate,
            req.body.terms
        );

        const xlsx = await PphServiceReportPeriodExcel(results); // Inisialisasi objek xlsx
        await xlsx.write(res);
        return res.end();
    }
);
GajiControllers.post(
    "/bpjs-excel",
    [
        UserServiceTokenAuthentication,
        // BpjsValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const bpjs = await BPJSServiceGetSlip("ID_Gaji", req.params.ID_Gaji, false);
        const items = await BPJSServiceGetSlip("ID_Gaji", req.params.ID_Gaji, true);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="bpjs-${new Date().getTime()}.xlsx"`
        );

        const xlsx = await BPJSServiceFakturExcel(); // Inisialisasi objek xlsx
        await xlsx.write(res);
        return res.end();
    }
);

GajiControllers.post(
    "/reportBpjs-period-excel",
    [
        UserServiceTokenAuthentication,
        // BpjsValidators.reportBpjsing.terms(),
        // BpjsValidators.reportBpjsing.startDate(),
        // BpjsValidators.reportBpjsing.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Report Potongan BPJS - ${req.body.startDate} sd ${req.body.endDate}.xlsx"`
        );

        const results = await BPJSServiceReportPeriod(
            req.body.startDate,
            req.body.endDate,
            req.body.terms
        );

        const xlsx = await BPJSServiceReportPeriodExcel(results); // Inisialisasi objek xlsx
        await xlsx.write(res);
        return res.end();
    }
);
GajiControllers.post(
    "/slip-excel",
    [
        UserServiceTokenAuthentication,
        // BpjsValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="slip-${new Date().getTime()}.xlsx"`
        );

        const xlsx = await createPayslipExcel();  
        await xlsx.write(res);
        return res.end();
    }
);
GajiControllers.post(
    "/:ID_Gaji/slip-excel",  // Add a route parameter for ID_Gaji
    [
        UserServiceTokenAuthentication,
        // BpjsValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="slip-${new Date().getTime()}.xlsx"`
        );

        const ID_Gaji = req.params.ID_Gaji; // Assuming ID_Gaji is available in the request parameters

        const xlsx = await createPayslipExcel(ID_Gaji);
        await xlsx.write(res);
        return res.end();
    }
);

module.exports = GajiControllers;