const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GOLONGAN_CONFIG_MAIN_TABLE } = require("../config");

const GolonganServiceDelete = async (ID_Golongan) => {
    try {
        await BaseServiceQueryBuilder(GOLONGAN_CONFIG_MAIN_TABLE)
            .where({ ID_Golongan })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = GolonganServiceDelete;
