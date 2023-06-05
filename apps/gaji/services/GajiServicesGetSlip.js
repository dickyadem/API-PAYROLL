const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_ITEM_BELI_TABLE } = require("../config");

const GajiServiceGetItemBeli = async (field, value, many = false) => {
    const results = await BaseServiceQueryBuilder(
        GAJI_CONFIG_ITEM_BELI_TABLE
    ).where({ [field]: value });
    if (many) {
        return results;
    }

    return results[0];
};

module.exports = GajiServiceGetItemBeli;
