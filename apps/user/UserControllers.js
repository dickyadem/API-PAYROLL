const { body } = require("express-validator");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserValidators = require("./UserValidators");
const UserServiceCreateJWT = require("./services/UserServiceCreateJWT");
const UserServiceRegister = require("./services/UserServiceRegister");

const router = require("express").Router();

router.post(
    "/login",
    [   
    ],
    async (req, res) => {
        const token = await UserServiceCreateJWT(req.body.email);
        return res.status(200).json(token);
    }
);
router.post(
    "/register",
    [
  
        UserValidators.password(),
        UserValidators.Status(),
        UserValidators.NamaBelakang(),
        UserValidators.NamaDepan(),
        UserValidators.email(),
        
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const user = await UserServiceRegister(
            req.body.NamaDepan,
            req.body.NamaBelakang,
            req.body.Status,
            req.body.email,
            req.body.password
        );

        return res.status(200).json(user);
    }
);

module.exports = router;
