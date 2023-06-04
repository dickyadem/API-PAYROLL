var bcrypt = require("bcryptjs");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../config");

const UserServiceRegister = async (ID_User, NamaDepan,NamaBelakang, Status, email, password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE).insert({ 
        ID_User,
        NamaDepan,
        NamaBelakang,
        Status,
        email,
        password: passwordHash,
    });

    return { NamaDepan, NamaBelakang, email };
};

module.exports = UserServiceRegister;
