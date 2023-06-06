const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");

const KaryawanServiceEdit = require("./services/KaryawanServiceEdit");
const KaryawanServiceGet = require("./services/KaryawanServiceGet");
const KaryawanServiceCreate = require("./services/KaryawanServiceCreate");
const KaryawanServiceList = require("./services/KaryawanServiceList");
const KaryawanServiceDelete = require("./services/KaryawanServiceDelete");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const KaryawanValidators = require("./KaryawanValidators");
const KaryawanControllers = require("express").Router();

KaryawanControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        KaryawanValidators.ID_Karyawan(),
        KaryawanValidators.Nama_Karyawan(),
        KaryawanValidators.Gaji_Pokok(),
        KaryawanValidators.ID_Golongan(),
        KaryawanValidators.ID_Jabatan(),
        KaryawanValidators.Divisi(),
        KaryawanValidators.Status_Pernikahan(),
        KaryawanValidators.Jumlah_Anak(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const karyawan = await KaryawanServiceCreate(
            req.body.ID_Karyawan,
            req.body.Nama_Karyawan,
            req.body.Gaji_Pokokan,
            req.body.ID_Golongan,
            req.body.ID_Jabatan,
            req.body.Divisi,
            req.body.Status_Pernikahan,
            req.body.Jumlah_Anak
        );
        return res.status(201).json(karyawan);
    }
);

KaryawanControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarKaryawan = await KaryawanServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarKaryawan);
    }
);

KaryawanControllers.get(
    "/:ID_Karyawan",
    [
        UserServiceTokenAuthentication,
        KaryawanValidators.ID_Karyawan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const karyawan = await KaryawanServiceGet("ID_Karyawan", req.params.ID_Karyawan);
        return res.status(200).json(karyawan);
    }
);

KaryawanControllers.put(
    "/:ID_Karyawan",
    [
        UserServiceTokenAuthentication,
        KaryawanValidators.ID_Karyawan(param, false),
        KaryawanValidators.Nama_Karyawan(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const karyawan = await KaryawanServiceEdit(
            req.params.ID_Karyawan,
            req.body.Nama_Karyawan,
        );
        return res.status(200).json(karyawan);
    }
);

KaryawanControllers.delete(
    "/:ID_Karyawan",
    [
        UserServiceTokenAuthentication,
        KaryawanValidators.ID_Karyawan(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const karyawan = await KaryawanServiceDelete(req.params.ID_Karyawan);
        return res.status(204).json(karyawan);
    }
);

module.exports = KaryawanControllers;
