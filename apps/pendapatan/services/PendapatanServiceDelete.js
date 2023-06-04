const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PENDAPATAN_CONFIG_MAIN_TABLE } = require("../config");

const PendapatanServiceDelete = async (ID_Pendapatan) => {
    try {
        await BaseServiceQueryBuilder(PENDAPATAN_CONFIG_MAIN_TABLE)
            .where({ ID_Pendapatan })
            .del();
    } catch (error) {
        console.log(error);
    } finally {
        return null;
    }
};

module.exports = PendapatanServiceDelete;
