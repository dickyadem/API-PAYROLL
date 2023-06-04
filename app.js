const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", require("./apps/user/UserControllers"));
app.use("/profil", require("./apps/profil/ProfilControllers"));
app.use("/potongan", require("./apps/potongan/PotonganControllers"));
app.use("/pendapatan", require("./apps/pendapatan/PendapatanControllers"));
// app.use("/karyawan", require("./apps/karyawan/KaryawanControllers"));
app.use("/jabatan", require("./apps/jabatan/JabatanControllers"));
app.use("/golongan", require("./apps/golongan/GolonganControllers"));
module.exports = app;
