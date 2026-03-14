
const { body } = require("express-validator")
const { param } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserValidators = require("./UserValidators");
const UserServiceCreateJWT = require("./services/UserServiceCreateJWT");
const UserServiceRegister = require("./services/UserServiceRegister");
const router = require("express").Router();
const authentication = require("./services/UserServiceTokenAuthentication");
const UserServiceList = require("./services/UserServiceList");
const BaseValidatorQueryPage = require("../base/validators/BaseValidatorQueryPage");
const UserServiceTokenAuthentication = require("./services/UserServiceTokenAuthentication");
const UserServiceFetch = require("./services/UserServiceFetch");
const UserControllers = require("express").Router();

router.post(
    "/login",
    [
        UserValidators.email(body, false),
        UserValidators.password(body, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const { token } = await UserServiceCreateJWT(req.body.email);
        const user = await UserServiceFetch(req.body.email);
        
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
    }
);
router.post("/world", [authentication], (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  })

router.post(
    "/register",
    [
        UserValidators.password(body),
        UserValidators.firstName(body),
        UserValidators.lastName(body),
        UserValidators.email(body),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        // Combine firstName + lastName into NamaLengkap
        const firstName = req.body.firstName || '';
        const lastName = req.body.lastName || '';
        const NamaLengkap = `${firstName} ${lastName}`.trim();
        
        const user = await UserServiceRegister(
            NamaLengkap,
            req.body.Status || true,  // Default true (active)
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
    }
);
router.get(
    "/",
    [
        BaseValidatorQueryPage(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const daftarUser = await UserServiceList(
            req.query.terms,
            req.query.page
        );
        return res.status(200).json(daftarUser);
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
        const user = await UserServiceGet("email", req.params.email);
        return res.status(200).json(user);
    }
);
module.exports = router;
