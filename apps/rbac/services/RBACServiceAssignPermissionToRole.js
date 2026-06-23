const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { 
    ROLE_PERMISSION_CONFIG_MAIN_TABLE 
} = require("../config");

const RBACServiceAssignPermissionToRole = async (ID_Role, ID_Permission) => {
    const { ROLE_CONFIG_MAIN_TABLE } = require("../config");
    const { PERMISSION_CONFIG_MAIN_TABLE } = require("../config");

    // Check if role exists
    const role = await BaseServiceQueryBuilder(ROLE_CONFIG_MAIN_TABLE)
        .where({ ID_Role })
        .first();

    if (!role) {
        throw new Error('Role tidak ditemukan');
    }

    // Check if permission exists
    const permission = await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE)
        .where({ ID_Permission })
        .first();

    if (!permission) {
        throw new Error('Permission tidak ditemukan');
    }

    // Check if assignment already exists
    const existing = await BaseServiceQueryBuilder(ROLE_PERMISSION_CONFIG_MAIN_TABLE)
        .where({ ID_Role, ID_Permission })
        .first();

    if (existing) {
        throw new Error('Permission sudah diassign ke role ini');
    }

    const data = { ID_Role, ID_Permission };
    await BaseServiceQueryBuilder(ROLE_PERMISSION_CONFIG_MAIN_TABLE).insert(data);

    return {
        message: 'Permission berhasil diassign ke role',
        ...data,
    };
};

module.exports = RBACServiceAssignPermissionToRole;
