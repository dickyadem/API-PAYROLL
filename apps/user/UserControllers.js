const { body } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserValidators = require("./UserValidators");
const UserServiceCreateJWT = require("./services/UserServiceCreateJWT");
const UserServiceRegister = require("./services/UserServiceRegister");

const router = require("express").Router();

router.post(
    "/login",
    [
        UserValidators.email(body, false),
        UserValidators.password(body, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const token = await UserServiceCreateJWT(req.body.email);
            return res.status(200).json(token);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);
router.post(
    "/register",
    [
        UserValidators.email(),
        UserValidators.password(),
        UserValidators.Status(),
        UserValidators.NamaBelakang(),
        UserValidators.NamaDepan(),
        UserValidators.ID_User(),

        BaseValidatorRun(),
    ],
    async (req, res) => {
        try {
            const user = await UserServiceRegister(
                req.body.ID_User,
                req.body.NamaDepan,
                req.body.NamaBelakang,
                req.body.Status,
                req.body.email,
                req.body.password
            );

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan server." });
        }
    }
);

module.exports = router;
