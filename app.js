const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

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

module.exports = app;
