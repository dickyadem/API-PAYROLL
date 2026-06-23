const {
    RBACServiceHasPermission,
    RBACServiceHasAnyPermission,
    RBACServiceHasAllPermissions,
} = require("../services/RBACService");

/**
 * Middleware to check if user has specific permission
 * Usage: RBACPermissionCheck('gaji.create')
 * 
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @param {string} mode - 'all' (default) or 'any'
 * @returns {Function} Express middleware
 */
const RBACPermissionCheck = (requiredPermissions, mode = 'all') => {
    return async (req, res, next) => {
        try {
            // Get user info from token (set by UserServiceTokenAuthentication)
            const userEmail = req.user?.email;
            const userRole = req.user?.role?.toLowerCase();

            if (!userEmail) {
                return res.status(401).json({
                    error: 'User tidak terautentikasi',
                });
            }

            // ADMIN role has all permissions - bypass permission check
            if (userRole === 'admin') {
                return next();
            }

            // Normalize to array
            const permissions = Array.isArray(requiredPermissions) 
                ? requiredPermissions 
                : [requiredPermissions];

            // Check permissions based on mode
            let hasAccess = false;

            if (mode === 'any') {
                hasAccess = await RBACServiceHasAnyPermission(userEmail, permissions);
            } else {
                hasAccess = await RBACServiceHasAllPermissions(userEmail, permissions);
            }

            if (!hasAccess) {
                return res.status(403).json({
                    error: 'Akses ditolak',
                    message: 'Anda tidak memiliki permission untuk melakukan aksi ini',
                    required: permissions,
                    yourRole: userRole,
                });
            }

            // Permission granted, proceed to next middleware
            next();
        } catch (error) {
            console.error('RBAC Permission Check Error:', error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    };
};

/**
 * Middleware to check if user has specific role
 * Usage: RBACRoleCheck('ADMIN')
 * 
 * @param {string|string[]} requiredRoles - Single role or array of roles
 * @returns {Function} Express middleware
 */
const RBACRoleCheck = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user?.role?.toLowerCase();

            if (!userRole) {
                return res.status(401).json({
                    error: 'User tidak terautentikasi',
                });
            }

            // Normalize to array and lowercase
            const roles = Array.isArray(requiredRoles) 
                ? requiredRoles.map(r => r.toLowerCase())
                : [requiredRoles.toLowerCase()];

            if (!roles.includes(userRole)) {
                return res.status(403).json({
                    error: 'Akses ditolak',
                    message: 'Role Anda tidak memiliki akses untuk melakukan aksi ini',
                    required: roles,
                    yourRole: userRole,
                });
            }

            next();
        } catch (error) {
            console.error('RBAC Role Check Error:', error);
            return res.status(500).json({
                error: 'Internal server error',
            });
        }
    };
};

module.exports = {
    RBACPermissionCheck,
    RBACRoleCheck,
};
