const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
    const existing = await knex("tbluser").where({ email: "admin@example.com" }).first();
    if (existing) {
        console.log("Admin user sudah ada, seed dilewati.");
        return;
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    await knex("tbluser").insert({
        ID_User: "USR001",
        NamaLengkap: "Admin",
        NamaDepan: "Admin",
        NamaBelakang: "",
        Status: "Active",
        email: "admin@example.com",
        password: passwordHash,
        role: "ADMIN",
        department: null,
    });

    console.log("Admin user berhasil dibuat.");
    console.log("Email   : admin@example.com");
    console.log("Password: admin123");
};
