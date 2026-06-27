const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const PotonganDetailServiceGet = require("./services/PotonganDetailServiceGet");
const PotonganDetailServiceList = require("./services/PotonganDetailServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const PotonganDetailServiceCreate = require("./services/PotonganDetailServiceCreate");
const PotonganDetailControllers = require("express").Router();


PotonganDetailControllers.post(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongandetail = await PotonganDetailServiceCreate(
            req.body.ID_Gaji,
            req.body.ID_Potongan,
            req.body.Jumlah_Potongan
        );
        return res.status(201).json(potongandetail);
    }
);

PotonganDetailControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarPotonganDetail = await PotonganDetailServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarPotonganDetail);
    }
);

PotonganDetailControllers.get(
    "/:ID_Gaji",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const potongandetail = await PotonganDetailServiceGet("ID_Gaji", req.params.ID_Gaji);
        return res.status(200).json(potongandetail);
    }
);





PotonganDetailControllers.put(
    "/:ID_Gaji/:ID_Potongan",
    [
        UserServiceTokenAuthentication,
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const db = require("../base/services/BaseServiceQueryBuilder");
            const row = await db("tblpotongandetail")
                .where({ ID_Gaji: req.params.ID_Gaji, ID_Potongan: req.params.ID_Potongan })
                .first();
            if (!row) return res.status(404).json({ error: "Data tidak ditemukan" });

            const { Jumlah_Potongan } = req.body;
            if (Jumlah_Potongan === undefined)
                return res.status(400).json({ error: "Jumlah_Potongan wajib diisi" });

            await db("tblpotongandetail")
                .where({ ID_Gaji: req.params.ID_Gaji, ID_Potongan: req.params.ID_Potongan })
                .update({ Jumlah_Potongan });

            const updated = await db("tblpotongandetail")
                .where({ ID_Gaji: req.params.ID_Gaji, ID_Potongan: req.params.ID_Potongan })
                .first();
            return res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

module.exports = PotonganDetailControllers;
