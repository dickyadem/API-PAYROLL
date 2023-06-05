const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJIDETAIL_CONFIG_MAIN_TABLE } = require("../config");

const GolonganServiceDelete = async (ID_Golongan) => {
    try {
        await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
            .where({ID_Gaji })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = GolonganServiceDelete;
