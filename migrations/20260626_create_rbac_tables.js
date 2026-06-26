exports.up = function (knex) {
    return knex.schema
        .createTable("tblroles", (table) => {
            table.string("ID_Role", 50).primary();
            table.string("Nama_Role", 100).notNullable();
            table.string("Keterangan", 255).nullable();
            table.timestamps(true, true);
        })
        .createTable("tblpermissions", (table) => {
            table.string("ID_Permission", 100).primary();
            table.string("Nama_Permission", 100).notNullable();
            table.string("Module", 50).nullable();
            table.string("Description", 255).nullable();
            table.timestamps(true, true);
        })
        .createTable("tblrolepermissions", (table) => {
            table.increments("id").primary();
            table.string("ID_Role", 50).references("ID_Role").inTable("tblroles").onDelete("CASCADE");
            table.string("ID_Permission", 100).references("ID_Permission").inTable("tblpermissions").onDelete("CASCADE");
            table.unique(["ID_Role", "ID_Permission"]);
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("tblrolepermissions")
        .dropTableIfExists("tblpermissions")
        .dropTableIfExists("tblroles");
};
