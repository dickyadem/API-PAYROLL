const express = require("express");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const BaseServiceQueryBuilder = require("../base/services/BaseServiceQueryBuilder");
const BaseServicePaginator = require("../base/services/BaseServicePaginator");
const { NOTIF_CONFIG_MAIN_TABLE } = require("./config");

const NotificationControllers = express.Router();

// GET /notifications — list notifikasi milik user yang login
NotificationControllers.get(
    "/",
    [UserServiceTokenAuthentication],
    async (req, res) => {
        try {
            const email = req.user.email;
            const page = req.query.page || 1;

            const queryBuilder = BaseServiceQueryBuilder(NOTIF_CONFIG_MAIN_TABLE)
                .where({ email })
                .orderBy("created_at", "desc");

            const result = await BaseServicePaginator(page, queryBuilder);
            return res.status(200).json({ ...result, terms: "" });
        } catch (error) {
            console.error("Notifications list error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
);

// PATCH /notifications/read-all — tandai semua notifikasi milik user sebagai sudah dibaca
// Harus sebelum /:id/read agar "read-all" tidak ditangkap sebagai :id
NotificationControllers.patch(
    "/read-all",
    [UserServiceTokenAuthentication],
    async (req, res) => {
        try {
            const email = req.user.email;

            await BaseServiceQueryBuilder(NOTIF_CONFIG_MAIN_TABLE)
                .where({ email, is_read: false })
                .update({ is_read: true });

            return res.status(200).json({ success: true, message: "Semua notifikasi ditandai sudah dibaca" });
        } catch (error) {
            console.error("Notification read-all error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
);

// PATCH /notifications/:id/read — tandai satu notifikasi sebagai sudah dibaca
NotificationControllers.patch(
    "/:id/read",
    [UserServiceTokenAuthentication],
    async (req, res) => {
        try {
            const email = req.user.email;
            const { id } = req.params;

            const notif = await BaseServiceQueryBuilder(NOTIF_CONFIG_MAIN_TABLE)
                .where({ id, email })
                .first();

            if (!notif) {
                return res.status(404).json({ success: false, message: "Notifikasi tidak ditemukan" });
            }

            await BaseServiceQueryBuilder(NOTIF_CONFIG_MAIN_TABLE)
                .where({ id, email })
                .update({ is_read: true });

            return res.status(200).json({ success: true, message: "Notifikasi ditandai sudah dibaca" });
        } catch (error) {
            console.error("Notification read error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
);

module.exports = NotificationControllers;
