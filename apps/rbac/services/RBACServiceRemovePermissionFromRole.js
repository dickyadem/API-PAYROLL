const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { 
    ROLE_PERMISSION_CONFIG_MAIN_TABLE 
} = require("../config");

const RBACServiceRemovePermissionFromRole = async (ID_Role, ID_Permission) => {
    // Check if assignment exists
    const existing = await BaseServiceQueryBuilder(ROLE_PERMISSION_CONFIG_MAIN_TABLE)
        .where({ ID_Role, ID_Permission })
        .first();

    if (!existing) {
        throw new Error('Permission tidak diassign ke role ini');
    }

    await BaseServiceQueryBuilder(ROLE_PERMISSION_CONFIG_MAIN_TABLE)
        .where({ ID_Role, ID_Permission })
        .del();

    return {
        message: 'Permission berhasil dihapus dari role',
        ID_Role,
        ID_Permission,
    };
};

module.exports = RBACServiceRemovePermissionFromRole;
