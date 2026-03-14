const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PERMISSION_CONFIG_MAIN_TABLE } = require("../config");

const RBACServiceCreatePermission = async (ID_Permission, Nama_Permission, Module, Description) => {
    // Check if permission already exists
    const existingPermission = await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE)
        .where({ ID_Permission })
        .first();

    if (existingPermission) {
        throw new Error('Permission sudah ada');
    }

    const data = {
        ID_Permission,
        Nama_Permission,
        Module,
        Description: Description || null,
    };

    await BaseServiceQueryBuilder(PERMISSION_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = RBACServiceCreatePermission;
