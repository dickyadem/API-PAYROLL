exports.up = async function (knex) {
    // tblkaryawan: tambah kolom yang dibutuhkan validator
    const hasGajiPokok = await knex.schema.hasColumn("tblkaryawan", "Gaji_Pokok");
    if (!hasGajiPokok) {
        await knex.schema.table("tblkaryawan", (table) => {
            table.decimal("Gaji_Pokok", 15, 2).defaultTo(0);
            table.string("Divisi", 100).nullable();
            table.string("Status_Pernikahan", 50).nullable();
            table.integer("Jumlah_Anak").defaultTo(0);
            table.string("email", 255).nullable();
        });
    }

    // tblpendapatan: tambah Nominal, ID_Jabatan, Keterangan
    const hasPendapatanNominal = await knex.schema.hasColumn("tblpendapatan", "Nominal");
    if (!hasPendapatanNominal) {
        await knex.schema.table("tblpendapatan", (table) => {
            table.decimal("Nominal", 15, 2).defaultTo(0);
            table.string("ID_Jabatan", 20).nullable().references("ID_Jabatan").inTable("tbljabatan");
            table.string("Keterangan", 255).nullable();
        });
    }

    // tblpotongan: tambah Nominal, ID_Jabatan, Keterangan
    const hasPotonganNominal = await knex.schema.hasColumn("tblpotongan", "Nominal");
    if (!hasPotonganNominal) {
        await knex.schema.table("tblpotongan", (table) => {
            table.decimal("Nominal", 15, 2).defaultTo(0);
            table.string("ID_Jabatan", 20).nullable().references("ID_Jabatan").inTable("tbljabatan");
            table.string("Keterangan", 255).nullable();
        });
    }
};

exports.down = async function (knex) {
    const hasGajiPokok = await knex.schema.hasColumn("tblkaryawan", "Gaji_Pokok");
    if (hasGajiPokok) {
        await knex.schema.table("tblkaryawan", (table) => {
            table.dropColumn("Gaji_Pokok");
            table.dropColumn("Divisi");
            table.dropColumn("Status_Pernikahan");
            table.dropColumn("Jumlah_Anak");
            table.dropColumn("email");
        });
    }
    const hasPendapatanNominal = await knex.schema.hasColumn("tblpendapatan", "Nominal");
    if (hasPendapatanNominal) {
        await knex.schema.table("tblpendapatan", (table) => {
            table.dropColumn("Nominal");
            table.dropColumn("ID_Jabatan");
            table.dropColumn("Keterangan");
        });
    }
    const hasPotonganNominal = await knex.schema.hasColumn("tblpotongan", "Nominal");
    if (hasPotonganNominal) {
        await knex.schema.table("tblpotongan", (table) => {
            table.dropColumn("Nominal");
            table.dropColumn("ID_Jabatan");
            table.dropColumn("Keterangan");
        });
    }
};
