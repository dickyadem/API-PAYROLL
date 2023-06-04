const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PROFIL_CONFIG_MAIN_TABLE } = require("../config");

const ProfilServiceDelete = async (ID_Profil) => {
    try {
        await BaseServiceQueryBuilder(PROFIL_CONFIG_MAIN_TABLE)
            .where({ ID_Profil })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = ProfilServiceDelete;
