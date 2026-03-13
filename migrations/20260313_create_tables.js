/**
 * Initial migration: Create all tables for payroll system
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("tbluser", (table) => {
            table.string("ID_User", 20).primary();
            table.string("NamaDepan", 100).notNullable();
            table.string("NamaBelakang", 100).notNullable();
            table.string("Status", 50).notNullable();
            table.string("email", 100).notNullable().unique();
            table.string("password", 255).notNullable();
            table.timestamps(true, true);
        })
        .createTable("tblprofil", (table) => {
            table.string("ID_Profil", 20).primary();
            table.string("Nama", 100).notNullable();
            table.text("Alamat").notNullable();
            table.string("Telepon", 15).notNullable();
            table.string("Fax", 20);
            table.string("Email", 100);
            table.string("Website", 100);
            table.timestamps(true, true);
        })
        .createTable("tblgolongan", (table) => {
            table.string("ID_Golongan", 20).primary();
            table.string("Nama_Golongan", 100).notNullable();
            table.decimal("Tunjangan_Golongan", 15, 2).defaultTo(0);
            table.timestamps(true, true);
        })
        .createTable("tbljabatan", (table) => {
            table.string("ID_Jabatan", 20).primary();
            table.string("Nama_Jabatan", 100).notNullable();
            table.decimal("Tunjangan_Jabatan", 15, 2).defaultTo(0);
            table.timestamps(true, true);
        })
        .createTable("tblpendapatan", (table) => {
            table.string("ID_Pendapatan", 20).primary();
            table.string("Nama_Pendapatan", 100).notNullable();
            table.timestamps(true, true);
        })
        .createTable("tblpotongan", (table) => {
            table.string("ID_Potongan", 20).primary();
            table.string("Nama_Potongan", 100).notNullable();
            table.timestamps(true, true);
        })
        .createTable("tblkaryawan", (table) => {
            table.string("ID_Karyawan", 20).primary();
            table.string("Nama_Karyawan", 100).notNullable();
            table.string("ID_Golongan", 20).references("ID_Golongan").inTable("tblgolongan");
            table.string("ID_Jabatan", 20).references("ID_Jabatan").inTable("tbljabatan");
            table.timestamps(true, true);
        })
        .createTable("tblgaji", (table) => {
            table.string("ID_Gaji", 20).primary();
            table.string("ID_Karyawan", 20).references("ID_Karyawan").inTable("tblkaryawan");
            table.decimal("Gaji_Pokok", 15, 2).defaultTo(0);
            table.date("Tanggal_Gaji");
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("tblgaji")
        .dropTableIfExists("tblkaryawan")
        .dropTableIfExists("tblpotongan")
        .dropTableIfExists("tblpendapatan")
        .dropTableIfExists("tbljabatan")
        .dropTableIfExists("tblgolongan")
        .dropTableIfExists("tblprofil")
        .dropTableIfExists("tbluser");
};
