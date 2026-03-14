const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { 
    ROLE_CONFIG_MAIN_TABLE, 
    PERMISSION_CONFIG_MAIN_TABLE, 
    ROLE_PERMISSION_CONFIG_MAIN_TABLE 
} = require("../config");
const { USER_CONFIG_MAIN_TABLE } = require("../../user/config");

/**
 * Get user permissions by user email
 * @param {string} userEmail - user email
 * @returns {Promise<string[]>} - Array of permission strings
 */
const RBACServiceGetUserPermissions = async (userEmail) => {
    // Get user's role
    const user = await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
        .where({ email: userEmail })
        .first();

    if (!user || !user.role) {
        return [];
    }

    const userRole = user.role.toLowerCase();

    // ADMIN has all permissions
    if (userRole === 'admin') {
        const allPermissions = await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE).select('ID_Permission');
        return allPermissions.map(p => p.ID_Permission);
    }

    // Get all permissions for this role
    const permissions = await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE)
        .join(
            ROLE_PERMISSION_CONFIG_MAIN_TABLE,
            `${PERMISSION_CONFIG_MAIN_TABLE}.ID_Permission`,
            `${ROLE_PERMISSION_CONFIG_MAIN_TABLE}.ID_Permission`
        )
        .where(`${ROLE_PERMISSION_CONFIG_MAIN_TABLE}.ID_Role`, userRole.toUpperCase())
        .select(`${PERMISSION_CONFIG_MAIN_TABLE}.ID_Permission`);

    return permissions.map(p => p.ID_Permission);
};

/**
 * Check if user has specific permission
 * @param {string} userEmail - user email
 * @param {string} permission - Permission string (e.g., 'gaji.create')
 * @returns {Promise<boolean>}
 */
const RBACServiceHasPermission = async (userEmail, permission) => {
    const permissions = await RBACServiceGetUserPermissions(userEmail);
    return permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string} userEmail - user email
 * @param {string[]} permissions - Array of permission strings
 * @returns {Promise<boolean>}
 */
const RBACServiceHasAnyPermission = async (userEmail, permissions) => {
    const userPermissions = await RBACServiceGetUserPermissions(userEmail);
    return permissions.some(p => userPermissions.includes(p));
};

/**
 * Check if user has all of the specified permissions
 * @param {string} userEmail - user email
 * @param {string[]} permissions - Array of permission strings
 * @returns {Promise<boolean>}
 */
const RBACServiceHasAllPermissions = async (userEmail, permissions) => {
    const userPermissions = await RBACServiceGetUserPermissions(userEmail);
    return permissions.every(p => userPermissions.includes(p));
};

/**
 * Get user role
 * @param {string} userEmail - user email
 * @returns {Promise<string|null>} - Role ID or null
 */
const RBACServiceGetUserRole = async (userEmail) => {
    const user = await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
        .where({ email: userEmail })
        .first();

    return user?.role || null;
};

/**
 * List all roles
 * @returns {Promise<Array>}
 */
const RBACServiceListRoles = async () => {
    return await BaseServiceQueryBuilder(ROLE_CONFIG_MAIN_TABLE).select('*');
};

/**
 * List all permissions
 * @returns {Promise<Array>}
 */
const RBACServiceListPermissions = async () => {
    return await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE).select('*');
};

/**
 * Get permissions by role
 * @param {string} roleId - ID_Role
 * @returns {Promise<Array>}
 */
const RBACServiceGetPermissionsByRole = async (roleId) => {
    const permissions = await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE)
        .join(
            ROLE_PERMISSION_CONFIG_MAIN_TABLE,
            `${PERMISSION_CONFIG_MAIN_TABLE}.ID_Permission`,
            `${ROLE_PERMISSION_CONFIG_MAIN_TABLE}.ID_Permission`
        )
        .where(`${ROLE_PERMISSION_CONFIG_MAIN_TABLE}.ID_Role`, roleId.toUpperCase())
        .select(`${PERMISSION_CONFIG_MAIN_TABLE}.*`);

    return permissions;
};

module.exports = {
    RBACServiceGetUserPermissions,
    RBACServiceHasPermission,
    RBACServiceHasAnyPermission,
    RBACServiceHasAllPermissions,
    RBACServiceGetUserRole,
    RBACServiceListRoles,
    RBACServiceListPermissions,
    RBACServiceGetPermissionsByRole,
};
