
const { body } = require("express-validator")
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const UserValidators = require("./UserValidators");
const UserServiceCreateJWT = require("./services/UserServiceCreateJWT");
const UserServiceRegister = require("./services/UserServiceRegister");
const router = require("express").Router();
const authentication = require("./services/UserServiceTokenAuthentication");

router.post(
    "/login",
    [   
        UserValidators.email(body, false),
        UserValidators.password(body, false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const token = await UserServiceCreateJWT(req.body.email);
        return res.status(200).json(token);
    }
);
router.post("/world", [authentication], (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  })

router.post(
    "/register",
    [
  
        UserValidators.password(),
        UserValidators.Status(),
        UserValidators.NamaLengkap(),
        UserValidators.email(),
        
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const user = await UserServiceRegister(
            req.body.NamaLengkap,
            req.body.Status,
            req.body.email,
            req.body.password
        );

        return res.status(200).json(user);
    }
);

module.exports = router;
