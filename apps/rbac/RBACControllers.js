const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const { RBACPermissionCheck, RBACRoleCheck } = require("./services/RBACMiddleware");
const {
    RBACServiceListRoles,
    RBACServiceListPermissions,
    RBACServiceGetPermissionsByRole,
} = require("./services/RBACService");
const RBACServiceCreateRole = require("./services/RBACServiceCreateRole");
const RBACServiceCreatePermission = require("./services/RBACServiceCreatePermission");
const RBACServiceAssignPermissionToRole = require("./services/RBACServiceAssignPermissionToRole");
const RBACServiceRemovePermissionFromRole = require("./services/RBACServiceRemovePermissionFromRole");
const RBACServiceAssignRoleToUser = require("./services/RBACServiceAssignRoleToUser");
const express = require("express");
const RBACControllers = express.Router();

// ========================================
// ROLES MANAGEMENT
// ========================================

// Get all roles
RBACControllers.get(
    "/roles",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const roles = await RBACServiceListRoles();
            res.status(200).json(roles);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Update role
RBACControllers.put(
    "/roles/:ID_Role",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const db = require("../base/services/BaseServiceQueryBuilder");
            const role = await db("tblroles").where({ ID_Role: req.params.ID_Role }).first();
            if (!role) return res.status(404).json({ error: "Role tidak ditemukan" });

            const updateData = {};
            if (req.body.Nama_Role !== undefined) updateData.Nama_Role = req.body.Nama_Role;
            if (req.body.Keterangan !== undefined) updateData.Keterangan = req.body.Keterangan;

            if (Object.keys(updateData).length === 0)
                return res.status(400).json({ error: "Tidak ada data yang diupdate" });

            await db("tblroles").where({ ID_Role: req.params.ID_Role }).update(updateData);
            const updated = await db("tblroles").where({ ID_Role: req.params.ID_Role }).first();
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Create new role
RBACControllers.post(
    "/roles",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const { ID_Role, Nama_Role, Keterangan } = req.body;
            const role = await RBACServiceCreateRole(ID_Role, Nama_Role, Keterangan);
            res.status(201).json(role);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: error.message });
        }
    }
);

// Get permissions by role
RBACControllers.get(
    "/roles/:ID_Role/permissions",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const permissions = await RBACServiceGetPermissionsByRole(req.params.ID_Role);
            res.status(200).json(permissions);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Assign permission to role
RBACControllers.post(
    "/roles/:ID_Role/permissions",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const { ID_Permission } = req.body;
            const result = await RBACServiceAssignPermissionToRole(
                req.params.ID_Role,
                ID_Permission
            );
            res.status(201).json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: error.message });
        }
    }
);

// Remove permission from role
RBACControllers.delete(
    "/roles/:ID_Role/permissions/:ID_Permission",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const result = await RBACServiceRemovePermissionFromRole(
                req.params.ID_Role,
                req.params.ID_Permission
            );
            res.status(200).json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: error.message });
        }
    }
);

// ========================================
// PERMISSIONS MANAGEMENT
// ========================================

// Get all permissions
RBACControllers.get(
    "/permissions",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const permissions = await RBACServiceListPermissions();
            res.status(200).json(permissions);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Update permission
RBACControllers.put(
    "/permissions/:ID_Permission",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const db = require("../base/services/BaseServiceQueryBuilder");
            const perm = await db("tblpermissions").where({ ID_Permission: req.params.ID_Permission }).first();
            if (!perm) return res.status(404).json({ error: "Permission tidak ditemukan" });

            const updateData = {};
            if (req.body.Nama_Permission !== undefined) updateData.Nama_Permission = req.body.Nama_Permission;
            if (req.body.Module !== undefined) updateData.Module = req.body.Module;
            if (req.body.Description !== undefined) updateData.Description = req.body.Description;

            if (Object.keys(updateData).length === 0)
                return res.status(400).json({ error: "Tidak ada data yang diupdate" });

            await db("tblpermissions").where({ ID_Permission: req.params.ID_Permission }).update(updateData);
            const updated = await db("tblpermissions").where({ ID_Permission: req.params.ID_Permission }).first();
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// Create new permission
RBACControllers.post(
    "/permissions",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const { ID_Permission, Nama_Permission, Module, Description } = req.body;
            const permission = await RBACServiceCreatePermission(
                ID_Permission,
                Nama_Permission,
                Module,
                Description
            );
            res.status(201).json(permission);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: error.message });
        }
    }
);

// ========================================
// USER ROLE ASSIGNMENT
// ========================================

// Assign role to user
RBACControllers.post(
    "/users/:email/role",
    [
        UserServiceTokenAuthentication,
        RBACPermissionCheck('role.manage'),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const { ID_Role } = req.body;
            const result = await RBACServiceAssignRoleToUser(
                req.params.email,
                ID_Role
            );
            res.status(200).json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(400).json({ error: error.message });
        }
    }
);

module.exports = RBACControllers;
