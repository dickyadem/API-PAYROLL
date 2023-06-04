const jwt = require("jsonwebtoken");

const UserServiceTokenAuthentication = async (req, res, next) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.headers["Authorization"];

    if (!token) {
        return res.status(401).json({
            errors: [
                {
                    type: "field",
                    value: token,
                    msg: "Token dibutuhkan untuk otentikasi",
                    path: "token",
                    location: "all",
                },
            ],
        });
    }

    try {
        const decodeToken = jwt.verify(token, process.env.TOKEN);
        req.user = decodeToken;
    } catch (error) {
        return res.status(401).json({
            errors: [
                {
                    type: "field",
                    value: token,
                    msg: "Token tidak valid",
                    path: "token",
                    location: "all",
                },
            ],
        });
    }

    return next();
};

module.exports = UserServiceTokenAuthentication;
