var bcrypt = require("bcryptjs");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../config");

const UserServiceRegister = async ( NamaLengkap, Status, email, password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE).insert({ 
    
        NamaLengkap,
        Status,
        email,
        password: passwordHash,
    });

    return { email, NamaLengkap };
};

module.exports = UserServiceRegister;
