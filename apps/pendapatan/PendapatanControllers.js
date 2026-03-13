const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");

const PendapatanServiceEdit = require("./services/PendapatanServiceEdit");
const PendapatanServiceGet = require("./services/PendapatanServiceGet");
const PendapatanServiceCreate = require("./services/PendapatanServiceCreate");
const PendapatanServiceList = require("./services/PendapatanServiceList");
const PendapatanServiceDelete = require("./services/PendapatanServiceDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const PendapatanValidators = require("./PendapatanValidators");
const PendapatanControllers = require("express").Router();

PendapatanControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        PendapatanValidators.ID_Pendapatan(),
        PendapatanValidators.Nama_Pendapatan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const pendapatan = await PendapatanServiceCreate(
                req.body.ID_Pendapatan,
                req.body.Nama_Pendapatan,
            );
            return res.status(201).json(pendapatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

PendapatanControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const daftarPendapatan = await PendapatanServiceList(
                req.query.terms,
                req.query.page
            );
            return res.status(200).json(daftarPendapatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

PendapatanControllers.get(
    "/:ID_Pendapatan",
    [
        UserServiceTokenAuthentication,
        PendapatanValidators.ID_Pendapatan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const pendapatan = await PendapatanServiceGet("ID_Pendapatan", req.params.ID_Pendapatan);
            return res.status(200).json(pendapatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

PendapatanControllers.put(
    "/:ID_Pendapatan",
    [
        UserServiceTokenAuthentication,
        PendapatanValidators.ID_Pendapatan(param, false),
        PendapatanValidators.Nama_Pendapatan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const pendapatan = await PendapatanServiceEdit(
                req.params.ID_Pendapatan,
                req.body.Nama_Pendapatan,
            );
            return res.status(200).json(pendapatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

PendapatanControllers.delete(
    "/:ID_Pendapatan",
    [
        UserServiceTokenAuthentication,
        PendapatanValidators.ID_Pendapatan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            await PendapatanServiceDelete(req.params.ID_Pendapatan);
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

module.exports = PendapatanControllers;
