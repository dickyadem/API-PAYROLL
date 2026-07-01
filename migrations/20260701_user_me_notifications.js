exports.up = async function (knex) {
    // Tambah kolom profil ke tbluser
    const hasPhone = await knex.schema.hasColumn("tbluser", "phone");
    if (!hasPhone) {
        await knex.schema.table("tbluser", (table) => {
            table.string("phone", 20).nullable();
            table.string("position", 100).nullable();
            table.date("joinDate").nullable();
            table.text("address").nullable();
            table.text("avatar").nullable();
        });
    }

    // Buat tblnotifikasi
    const hasNotif = await knex.schema.hasTable("tblnotifikasi");
    if (!hasNotif) {
        await knex.schema.createTable("tblnotifikasi", (table) => {
            table.increments("id").primary();
            table.string("email", 100).notNullable();
            table.enum("type", ["success", "warning", "info"]).defaultTo("info");
            table.string("title", 255).notNullable();
            table.text("message").nullable();
            table.boolean("is_read").defaultTo(false);
            table.timestamps(true, true);
        });
    }
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("tblnotifikasi");
    const hasPhone = await knex.schema.hasColumn("tbluser", "phone");
    if (hasPhone) {
        await knex.schema.table("tbluser", (table) => {
            table.dropColumn("phone");
            table.dropColumn("position");
            table.dropColumn("joinDate");
            table.dropColumn("address");
            table.dropColumn("avatar");
        });
    }
};
