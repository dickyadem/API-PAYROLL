const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");

const JabatanServiceEdit = require("./services/JabatanServiceEdit");
const JabatanServiceGet = require("./services/JabatanServiceGet");
const JabatanServiceCreate = require("./services/JabatanServiceCreate");
const JabatanServiceList = require("./services/JabatanServiceList");
const JabatanServiceDelete = require("./services/JabatanServiceDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const JabatanValidators = require("./JabatanValidators");
const JabatanControllers = require("express").Router();

JabatanControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        JabatanValidators.ID_Jabatan(),
        JabatanValidators.Nama_Jabatan(),
        JabatanValidators.Tunjangan_Jabatan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const jabatan = await JabatanServiceCreate(
                req.body.ID_Jabatan,
                req.body.Nama_Jabatan,
            );
            return res.status(201).json(jabatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

JabatanControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const daftarJabatan = await JabatanServiceList(
                req.query.terms,
                req.query.page
            );
            return res.status(200).json(daftarJabatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

JabatanControllers.get(
    "/:ID_Jabatan",
    [
        UserServiceTokenAuthentication,
        JabatanValidators.ID_Jabatan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const jabatan = await JabatanServiceGet("ID_Jabatan", req.params.ID_Jabatan);
            return res.status(200).json(jabatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

JabatanControllers.put(
    "/:ID_Jabatan",
    [
        UserServiceTokenAuthentication,
        JabatanValidators.ID_Jabatan(param, false),
        JabatanValidators.Nama_Jabatan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const jabatan = await JabatanServiceEdit(
                req.params.ID_Jabatan,
                req.body.Nama_Jabatan,
                req.body.Tunjangan_Jabatan
            );
            return res.status(200).json(jabatan);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

JabatanControllers.delete(
    "/:ID_Jabatan",
    [
        UserServiceTokenAuthentication,
        JabatanValidators.ID_Jabatan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            await JabatanServiceDelete(req.params.ID_Jabatan);
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

module.exports = JabatanControllers;
