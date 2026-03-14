const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { ROLE_CONFIG_MAIN_TABLE } = require("../config");

const RBACServiceCreateRole = async (ID_Role, Nama_Role, Keterangan) => {
    // Check if role already exists
    const existingRole = await BaseServiceQueryBuilder(ROLE_CONFIG_MAIN_TABLE)
        .where({ ID_Role })
        .first();

    if (existingRole) {
        throw new Error('Role sudah ada');
    }

    const data = {
        ID_Role,
        Nama_Role,
        Keterangan: Keterangan || null,
    };

    await BaseServiceQueryBuilder(ROLE_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = RBACServiceCreateRole;
