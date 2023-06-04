const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const { PEMBELIAN_CONFIG_MAIN_TABLE } = require("../config");

const PembelianServiceList = async (terms, page) => {
  const queryBuilder = BaseServiceQueryBuilder(PEMBELIAN_CONFIG_MAIN_TABLE);

  if (terms) {
    queryBuilder.whereILike("faktur", `%${terms}%`);
  }

  return {
    ...(await BaseServicePaginator(page, queryBuilder)),
    terms: terms ? terms : "",
  };
};

module.exports = PembelianServiceList;
