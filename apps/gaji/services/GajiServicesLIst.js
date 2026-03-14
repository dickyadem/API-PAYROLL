const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const { 
  GAJI_CONFIG_MAIN_TABLE,
  PENDAPATANDETAIL_CONFIG_MAIN_TABLE,
  POTONGANDETAIL_CONFIG_MAIN_TABLE
} = require("../config");

const GajiServiceList = async (terms, page) => {
  const queryBuilder = BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE);

  if (terms) {
    queryBuilder.whereILike("ID_Gaji", `%${terms}%`);
  }

  const result = await BaseServicePaginator(page, queryBuilder);

  // Include itemsPendapatan and itemsPotongan for each gaji
  const gajiWithItems = await Promise.all(
    result.results.map(async (gaji) => {
      const itemsPendapatan = await BaseServiceQueryBuilder(
        PENDAPATANDETAIL_CONFIG_MAIN_TABLE
      ).where({ ID_Gaji: gaji.ID_Gaji });

      const itemsPotongan = await BaseServiceQueryBuilder(
        POTONGANDETAIL_CONFIG_MAIN_TABLE
      ).where({ ID_Gaji: gaji.ID_Gaji });

      return {
        ...gaji,
        itemsPendapatan: itemsPendapatan || [],
        itemsPotongan: itemsPotongan || []
      };
    })
  );

  return {
    ...result,
    results: gajiWithItems,
    terms: terms ? terms : "",
  };
};

module.exports = GajiServiceList;
