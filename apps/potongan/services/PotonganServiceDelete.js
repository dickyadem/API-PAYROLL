const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { POTONGAN_CONFIG_MAIN_TABLE } = require("../config");

const PotonganServiceDelete = async (ID_Potongan) => {
    try {
        await BaseServiceQueryBuilder(POTONGAN_CONFIG_MAIN_TABLE)
            .where({ ID_Potongan })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = PotonganServiceDelete;
