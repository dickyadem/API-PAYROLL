const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const PendapatanDetailServiceGet = require("./services/PendapatanDetailServiceGet");
const PendapatanDetailServiceList = require("./services/PendapatanDetailServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const PendapatanDetailServiceCreate = require("./services/PendapatanDetailServiceCreate");
const PendapatanDetailControllers = require("express").Router();


PendapatanDetailControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const pendapatandetail = await PendapatanDetailServiceCreate(
            req.body.ID_Gaji,
            req.body.ID_Pendapatan,
            req.body.Jumlah_Pendapatan
        );
        return res.status(201).json(pendapatandetail);
    }
);

PendapatanDetailControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarPendapatanDetail = await PendapatanDetailServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarPendapatanDetail);
    }
);

PendapatanDetailControllers.get(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const pendapatandetail = await PendapatanDetailServiceGet("ID_Gaji", req.params.ID_Gaji);
        return res.status(200).json(pendapatandetail);
    }
);





PendapatanDetailControllers.put(
    "/:ID_Gaji/:ID_Pendapatan",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const db = require("../base/services/BaseServiceQueryBuilder");
            const row = await db("tblpendapatandetail")
                .where({ ID_Gaji: req.params.ID_Gaji, ID_Pendapatan: req.params.ID_Pendapatan })
                .first();
            if (!row) return res.status(404).json({ error: "Data tidak ditemukan" });

            const { Jumlah_Pendapatan } = req.body;
            if (Jumlah_Pendapatan === undefined)
                return res.status(400).json({ error: "Jumlah_Pendapatan wajib diisi" });

            await db("tblpendapatandetail")
                .where({ ID_Gaji: req.params.ID_Gaji, ID_Pendapatan: req.params.ID_Pendapatan })
                .update({ Jumlah_Pendapatan });

            const updated = await db("tblpendapatandetail")
                .where({ ID_Gaji: req.params.ID_Gaji, ID_Pendapatan: req.params.ID_Pendapatan })
                .first();
            return res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

module.exports = PendapatanDetailControllers;
