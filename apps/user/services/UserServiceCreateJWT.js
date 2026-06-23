const jwt = require("jsonwebtoken");
const UserServiceFetch = require("./UserServiceFetch");

const UserServiceCreateJWT = async (email, expiresIn = "24h") => {
    const user = await UserServiceFetch(email);
    const token = jwt.sign(
        {
            email: user.email,
            NamaLengkap: user.NamaLengkap,
            role: user.role || 'user',  // Use existing 'role' column
            department: user.department || null
        },
        process.env.TOKEN,
        { expiresIn }
    );

    return { token };
};

module.exports = UserServiceCreateJWT;
