const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { JABATAN_CONFIG_MAIN_TABLE } = require("../config");

const JabatanServiceDelete = async (ID_Jabatan) => {
    try {
        await BaseServiceQueryBuilder(JABATAN_CONFIG_MAIN_TABLE)
            .where({ ID_Jabatan })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = JabatanServiceDelete;
