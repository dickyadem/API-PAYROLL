const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["TOKEN"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missingVars.join(", ")}`);
    console.error("Pastikan file .env sudah dikonfigurasi dengan benar.");
    process.exit(1);
}

const app = express();

// Global middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/user", require("./apps/user/UserControllers"));
app.use("/profil", require("./apps/profil/ProfilControllers"));
app.use("/potongan", require("./apps/potongan/PotonganControllers"));
app.use("/pendapatan", require("./apps/pendapatan/PendapatanControllers"));
app.use("/golongan", require("./apps/golongan/GolonganControllers"));
app.use("/jabatan", require("./apps/jabatan/JabatanControllers"));

// 404 handler
app.use((req, res) => {
    return res.status(404).json({ message: "Route tidak ditemukan." });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
});

module.exports = app;
