const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { KARYAWAN_CONFIG_MAIN_TABLE } = require("../config");

const KaryawanServiceDelete = async (ID_Karyawan) => {
    try {
        await BaseServiceQueryBuilder(KARYAWAN_CONFIG_MAIN_TABLE)
            .where({ ID_Karyawan })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = KaryawanServiceDelete;
