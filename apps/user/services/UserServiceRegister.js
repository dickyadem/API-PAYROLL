var bcrypt = require("bcryptjs");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../config");

const UserServiceRegister = async (NamaLengkap, Status, email, password, role = 'user', department = null) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const statusValue = typeof Status === 'boolean'
        ? (Status ? 'Active' : 'Inactive')
        : (Status || 'Active');

    const count = await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE).count('ID_User as c').first();
    const nextNum = (parseInt(count.c) || 0) + 1;
    const ID_User = `USR${String(nextNum).padStart(3, '0')}`;

    await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE).insert({
        ID_User,
        NamaLengkap,
        Status: statusValue,
        email,
        password: passwordHash,
        role: role || 'user',
        department: department || null
    });

    return { email, NamaLengkap, role: role || 'user', department, Status: statusValue };
};

module.exports = UserServiceRegister;
