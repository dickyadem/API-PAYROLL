var bcrypt = require("bcryptjs");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../config");

const UserServiceRegister = async ( NamaDepan,NamaBelakang, Status, email, password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE).insert({ 
    
        NamaDepan,
        NamaBelakang,
        Status,
        email,
        password: passwordHash,
    });

    return { email, NamaDepan, NamaBelakang };
};

module.exports = UserServiceRegister;
