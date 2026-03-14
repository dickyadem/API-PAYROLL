const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../../user/config");
const { ROLE_CONFIG_MAIN_TABLE } = require("../config");

const RBACServiceAssignRoleToUser = async (email, ID_Role) => {
    // Check if user exists
    const user = await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
        .where({ email })
        .first();

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    // Check if role exists
    const role = await BaseServiceQueryBuilder(ROLE_CONFIG_MAIN_TABLE)
        .where({ ID_Role })
        .first();

    if (!role) {
        throw new Error('Role tidak ditemukan');
    }

    // Update user's role
    await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
        .where({ email })
        .update({ role: ID_Role });

    return {
        message: 'Role berhasil diassign ke user',
        email,
        ID_Role,
    };
};

module.exports = RBACServiceAssignRoleToUser;
