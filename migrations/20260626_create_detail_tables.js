exports.up = async function (knex) {
    // Tambah kolom baru ke tblgaji yang dibutuhkan kode tapi belum ada di schema awal
    const hasGajiBersih = await knex.schema.hasColumn("tblgaji", "Gaji_Bersih");
    if (!hasGajiBersih) {
        await knex.schema.table("tblgaji", (table) => {
            table.date("Tanggal").nullable();
            table.decimal("Total_Pendapatan", 15, 2).defaultTo(0);
            table.decimal("Total_Potongan", 15, 2).defaultTo(0);
            table.decimal("Gaji_Bersih", 15, 2).defaultTo(0);
            table.string("Keterangan", 255).nullable();
            table.string("email", 100).nullable();
            table.string("ID_Profil", 20).nullable();
        });
    }

    // Buat tblpendapatandetail jika belum ada
    const hasPendapatanDetail = await knex.schema.hasTable("tblpendapatandetail");
    if (!hasPendapatanDetail) {
        await knex.schema.createTable("tblpendapatandetail", (table) => {
            table.increments("id").primary();
            table.string("ID_Gaji", 20).references("ID_Gaji").inTable("tblgaji").onDelete("CASCADE");
            table.string("ID_Pendapatan", 20).references("ID_Pendapatan").inTable("tblpendapatan");
            table.decimal("Jumlah_Pendapatan", 15, 2).defaultTo(0);
            table.timestamps(true, true);
        });
    }

    // Buat tblpotongandetail jika belum ada
    const hasPotonganDetail = await knex.schema.hasTable("tblpotongandetail");
    if (!hasPotonganDetail) {
        await knex.schema.createTable("tblpotongandetail", (table) => {
            table.increments("id").primary();
            table.string("ID_Gaji", 20).references("ID_Gaji").inTable("tblgaji").onDelete("CASCADE");
            table.string("ID_Potongan", 20).references("ID_Potongan").inTable("tblpotongan");
            table.decimal("Jumlah_Potongan", 15, 2).defaultTo(0);
            table.timestamps(true, true);
        });
    }
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("tblpotongandetail");
    await knex.schema.dropTableIfExists("tblpendapatandetail");
    const hasGajiBersih = await knex.schema.hasColumn("tblgaji", "Gaji_Bersih");
    if (hasGajiBersih) {
        await knex.schema.table("tblgaji", (table) => {
            table.dropColumn("Tanggal");
            table.dropColumn("Total_Pendapatan");
            table.dropColumn("Total_Potongan");
            table.dropColumn("Gaji_Bersih");
            table.dropColumn("Keterangan");
            table.dropColumn("email");
            table.dropColumn("ID_Profil");
        });
    }
};
