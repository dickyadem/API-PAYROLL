const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const GajiValidators = require("./GajiValidators");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const GajiServiceCreate = require("./services/GajiServicesCreate");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const { query, param } = require("express-validator");
const GajiServiceList = require("./services/GajiServicesList");
const GajiServiceGet = require("./services/GajiServicesGet");
const GajiServiceDelete = require("./services/GajiServicesDelete");
const { RBACPermissionCheck } = require("../rbac/services/RBACMiddleware");
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
        RBACPermissionCheck('gaji.create'),
        GajiValidators.ID_Gaji(),
        GajiValidators.Tanggal(),
        GajiValidators.ID_Karyawan(),
        GajiValidators.Total_Pendapatan(),
        GajiValidators.Total_Potongan(),
        GajiValidators.Gaji_Bersih(),
        GajiValidators.Keterangan(),
        GajiValidators.email(),
        GajiValidators.ID_Profil(),
        GajiValidators.itemsPendapatan.self(),
        GajiValidators.itemsPendapatan.innerPendapatan.ID_Pendapatan(),
        GajiValidators.itemsPendapatan.innerPendapatan.Jumlah_Pendapatan(),
        GajiValidators.itemsPotongan.self(),
        GajiValidators.itemsPotongan.innerPotongan.ID_Potongan(),
        GajiValidators.itemsPotongan.innerPotongan.Jumlah_Potongan(),

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
                req.body.itemsPendapatan,
                req.body.itemsPotongan,

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
        RBACPermissionCheck('gaji.read'),
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
        RBACPermissionCheck('gaji.read'),
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

GajiControllers.delete(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('gaji.delete'),
        GajiValidators.ID_Gaji(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const result = await GajiServiceDelete(req.params.ID_Gaji);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: error.message });
        }
    }
);

GajiControllers.post(
    "/gaji-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('gaji.export'),
        // GajiValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
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
        } catch (error) {
            console.error("Error gaji-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor data gaji" });
        }
    }
);

GajiControllers.post(
    "/report-period-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.period'),
        GajiValidators.reporting.startDate(),
        GajiValidators.reporting.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
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
        } catch (error) {
            console.error("Error report-period-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor laporan periode gaji" });
        }
    }
);
GajiControllers.post(
    "/pph-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.pph'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="pph-${new Date().getTime()}.xlsx"`
            );

            const xlsx = await PphServiceFakturExcel();
            await xlsx.write(res);
            return res.end();
        } catch (error) {
            console.error("Error pph-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor data PPH" });
        }
    }
);

GajiControllers.post(
    "/reportPph-period-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.pph'),
        GajiValidators.reporting.startDate(),
        GajiValidators.reporting.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
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

            const xlsx = await PphServiceReportPeriodExcel(results);
            await xlsx.write(res);
            return res.end();
        } catch (error) {
            console.error("Error reportPph-period-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor laporan periode PPH" });
        }
    }
);
GajiControllers.post(
    "/bpjs-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.bpjs'),
        // BpjsValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="bpjs-${new Date().getTime()}.xlsx"`
            );

            const xlsx = await BPJSServiceFakturExcel();
            await xlsx.write(res);
            return res.end();
        } catch (error) {
            console.error("Error bpjs-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor data BPJS" });
        }
    }
);

GajiControllers.post(
    "/reportBpjs-period-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.bpjs'),
        GajiValidators.reporting.startDate(),
        GajiValidators.reporting.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
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

            const xlsx = await BPJSServiceReportPeriodExcel(results);
            await xlsx.write(res);
            return res.end();
        } catch (error) {
            console.error("Error reportBpjs-period-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor laporan periode BPJS" });
        }
    }
);
GajiControllers.post(
    "/slip-excel",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.slip'),
        // BpjsValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
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
        } catch (error) {
            console.error("Error slip-excel:", error);
            res.status(500).json({ error: "Gagal mengekspor slip gaji" });
        }
    }
);
GajiControllers.post(
    "/:ID_Gaji/slip-excel",  // Add a route parameter for ID_Gaji
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('laporan.slip'),
        // BpjsValidators.ID_Gaji("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="slip-${new Date().getTime()}.xlsx"`
            );

            const ID_Gaji = req.params.ID_Gaji;
            const xlsx = await createPayslipExcel(ID_Gaji);
            await xlsx.write(res);
            return res.end();
        } catch (error) {
            console.error("Error slip-excel by ID:", error);
            res.status(500).json({ error: "Gagal mengekspor slip gaji" });
        }
    }
);

module.exports = GajiControllers;