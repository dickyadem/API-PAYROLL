const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map(o => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Izinkan request tanpa origin (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} tidak diizinkan`));
    },
    credentials: true
}));

// Rate limiter global: 100 request per 15 menit per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Terlalu banyak request, coba lagi nanti." },
});

// Rate limiter ketat untuk auth: 10 request per 15 menit per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Terlalu banyak percobaan login, coba lagi nanti." },
});

app.use(globalLimiter);
app.use("/user/login", authLimiter);
app.use("/user/register", authLimiter);

app.use("/user", require("./apps/user/UserControllers"));
app.use("/hello", require("./apps/user/UserControllers"));
app.use("/profil", require("./apps/profil/ProfilControllers"));
app.use("/potongan", require("./apps/potongan/PotonganControllers"));
app.use("/pendapatan", require("./apps/pendapatan/PendapatanControllers"));
app.use("/karyawan", require("./apps/karyawan/KaryawanControllers"));
app.use("/jabatan", require("./apps/jabatan/JabatanControllers"));
app.use("/golongan", require("./apps/golongan/GolonganControllers"));
app.use("/gaji", require("./apps/gaji/GajiControllers"));
app.use("/gajidetail", require("./apps/gajidetail/GajiDetailControllers"));
app.use("/potongandetail", require("./apps/potongandetail/PotonganDetailControllers"));
app.use("/pendapatandetail", require("./apps/pendapatandetail/PendapatanDetailControllers"));
app.use("/rbac", require("./apps/rbac/RBACControllers"));
app.use("/notifications", require("./apps/notifications/NotificationControllers"));

// Fix #14 — Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Fix #11 — Centralized error handler (harus di paling bawah setelah semua routes)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
    });
});

module.exports = app;
