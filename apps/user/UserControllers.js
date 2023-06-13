
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
const UserControllers = require("express").Router();

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
