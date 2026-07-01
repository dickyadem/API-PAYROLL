
const { body } = require("express-validator")
const { param } = require("express-validator");
const bcrypt = require("bcryptjs");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserValidators = require("./UserValidators");
const UserServiceCreateJWT = require("./services/UserServiceCreateJWT");
const UserServiceRegister = require("./services/UserServiceRegister");
const UserServiceList = require("./services/UserServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const UserServiceTokenAuthentication = require("./services/UserServiceTokenAuthentication");
const UserServiceFetch = require("./services/UserServiceFetch");
const BaseServiceQueryBuilder = require("../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("./config");
const { RBACRoleCheck } = require("../rbac/services/RBACMiddleware");

const UserControllers = require("express").Router();

UserControllers.post(
    "/login",
    [
        UserValidators.email(body, false),
        UserValidators.password(body, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const user = await UserServiceFetch(req.body.email);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Email atau password salah"
                });
            }

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Email atau password salah"
                });
            }

            const { token } = await UserServiceCreateJWT(req.body.email);

            return res.status(200).json({
                success: true,
                token: token,
                user: {
                    email: user.email,
                    username: user.NamaLengkap,
                    role: user.role || 'user',
                    department: user.department || null
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

UserControllers.post("/world", [UserServiceTokenAuthentication], (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

UserControllers.post(
    "/register",
    [
        UserServiceTokenAuthentication,
        RBACRoleCheck(['ADMIN']),
        UserValidators.password(body),
        UserValidators.firstName(body),
        UserValidators.lastName(body),
        UserValidators.email(body),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const firstName = req.body.firstName || '';
            const lastName = req.body.lastName || '';
            const NamaLengkap = `${firstName} ${lastName}`.trim();

            const user = await UserServiceRegister(
                NamaLengkap,
                req.body.Status || true,
                req.body.email,
                req.body.password,
                req.body.role || 'user',
                req.body.department || null
            );

            return res.status(201).json({
                success: true,
                message: "User berhasil didaftarkan",
                data: {
                    email: user.email,
                    username: user.NamaLengkap,
                    role: user.role,
                    department: user.department
                }
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

UserControllers.get(
    "/",
    [
        UserServiceTokenAuthentication,
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const daftarUser = await UserServiceList(
                req.query.terms,
                req.query.page
            );
            return res.status(200).json(daftarUser);
        } catch (error) {
            console.error("User list error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

UserControllers.put(
    "/change-password",
    [
        UserServiceTokenAuthentication,
        body("oldPassword")
            .notEmpty()
            .withMessage("Password lama wajib diisi."),
        body("newPassword")
            .notEmpty()
            .withMessage("Password baru wajib diisi.")
            .isLength({ min: 8 })
            .withMessage("Password baru minimal 8 karakter."),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const user = await UserServiceFetch(req.user.email);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User tidak ditemukan"
                });
            }

            const isOldPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);

            if (!isOldPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Password lama tidak sesuai"
                });
            }

            const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);

            await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
                .where({ email: req.user.email })
                .update({ password: newPasswordHash });

            return res.status(200).json({
                success: true,
                message: "Password berhasil diubah"
            });
        } catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

UserControllers.put(
    "/reset-password/:email",
    [
        UserServiceTokenAuthentication,
        RBACRoleCheck(['ADMIN']),
        body("newPassword")
            .notEmpty()
            .withMessage("Password baru wajib diisi.")
            .isLength({ min: 8 })
            .withMessage("Password baru minimal 8 karakter."),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const user = await UserServiceFetch(req.params.email);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User tidak ditemukan"
                });
            }

            const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);

            await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
                .where({ email: req.params.email })
                .update({ password: newPasswordHash });

            return res.status(200).json({
                success: true,
                message: `Password untuk ${req.params.email} berhasil direset`
            });
        } catch (error) {
            console.error("Reset password error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// GET /user/me dan PUT /user/me harus sebelum /:email agar tidak tertangkap wildcard
UserControllers.get(
    "/me",
    [UserServiceTokenAuthentication],
    async (req, res) => {
        try {
            const user = await UserServiceFetch(req.user.email);
            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }
            const { password, ...safeUser } = user;
            return res.status(200).json({ success: true, data: safeUser });
        } catch (error) {
            console.error("User me error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
);

UserControllers.put(
    "/me",
    [
        UserServiceTokenAuthentication,
        body("NamaLengkap").optional().trim().isLength({ min: 1 }).withMessage("Nama tidak boleh kosong."),
        body("phone").optional().trim(),
        body("position").optional().trim(),
        body("joinDate").optional().isISO8601().withMessage("Format tanggal tidak valid (YYYY-MM-DD)."),
        body("address").optional().trim(),
        body("avatar").optional(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const updateData = {};
            if (req.body.NamaLengkap !== undefined) updateData.NamaLengkap = req.body.NamaLengkap;
            if (req.body.phone !== undefined) updateData.phone = req.body.phone;
            if (req.body.position !== undefined) updateData.position = req.body.position;
            if (req.body.joinDate !== undefined) updateData.joinDate = req.body.joinDate;
            if (req.body.address !== undefined) updateData.address = req.body.address;
            if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: "Tidak ada data yang diupdate" });
            }

            await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
                .where({ email: req.user.email })
                .update(updateData);

            const updated = await UserServiceFetch(req.user.email);
            const { password, ...safeUser } = updated;
            return res.status(200).json({ success: true, message: "Profil berhasil diupdate", data: safeUser });
        } catch (error) {
            console.error("User me update error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
);

UserControllers.put(
    "/:email",
    [
        UserServiceTokenAuthentication,
        RBACRoleCheck(['ADMIN']),
        UserValidators.email(param, false),
        body("NamaLengkap").optional().trim().isLength({ min: 1 }).withMessage("Nama tidak boleh kosong."),
        body("role").optional().trim(),
        body("department").optional().trim(),
        body("Status").optional().trim(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const user = await UserServiceFetch(req.params.email);
            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" });
            }

            const updateData = {};
            if (req.body.NamaLengkap !== undefined) updateData.NamaLengkap = req.body.NamaLengkap;
            if (req.body.role !== undefined) updateData.role = req.body.role;
            if (req.body.department !== undefined) updateData.department = req.body.department;
            if (req.body.Status !== undefined) updateData.Status = req.body.Status;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: "Tidak ada data yang diupdate" });
            }

            await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE)
                .where({ email: req.params.email })
                .update(updateData);

            const updated = await UserServiceFetch(req.params.email);
            return res.status(200).json({ success: true, message: "User berhasil diupdate", data: updated });
        } catch (error) {
            console.error("User update error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
);

UserControllers.get(
    "/:email",
    [
        UserServiceTokenAuthentication,
        UserValidators.email(param, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const user = await UserServiceFetch(req.params.email);
            if (!user) {
                return res.status(404).json({ error: "User tidak ditemukan" });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error("User fetch error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

module.exports = UserControllers;
