var bcrypt = require("bcryptjs");
const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { USER_CONFIG_MAIN_TABLE } = require("../config");

const UserServiceRegister = async (NamaLengkap, Status, email, password, role = 'user', department = null) => {
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Convert boolean Status to string if needed
    const statusValue = typeof Status === 'boolean' 
        ? (Status ? 'Active' : 'Inactive') 
        : (Status || 'Active');
    
    await BaseServiceQueryBuilder(USER_CONFIG_MAIN_TABLE).insert({
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
