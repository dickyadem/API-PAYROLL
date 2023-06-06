const jwt = require("jsonwebtoken");
const UserServiceFetch = require("./UserServiceFetch");

const UserServiceCreateJWT = async (email, expiresIn = "24h") => {
    const user = await UserServiceFetch(email);
    const token = jwt.sign(
        {NamaDepan: user.NamaDepan, NamaBelakang: user.NamaBelakang, email },
        process.env.TOKEN,
        { expiresIn }
    );

    return { token };
};

module.exports = UserServiceCreateJWT;
