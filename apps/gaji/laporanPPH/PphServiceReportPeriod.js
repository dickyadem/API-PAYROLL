const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_MAIN_TABLE, DATAPROFIL_CONFIG_TABLE } = require("../config");

const PphServiceReportPeriod = async (startDate, endDate) => {
    try {
        let subQuery = await BaseServiceQueryBuilder.fetchAll(GAJI_CONFIG_MAIN_TABLE)
            .clone()
            .select("ID_Gaji")
            .whereBetween("Tanggal", [startDate, endDate]);

        subQuery = subQuery.map((item) => item.ID_Gaji);

        let results = await BaseServiceQueryBuilder.fetchAll(GAJI_CONFIG_MAIN_TABLE)
            .select([
                "tblgaji.ID_Gaji",
                "tblgaji.ID_Karyawan",
                "tblkaryawan.Nama_Karyawan",
            ])
            .innerJoin("tblkaryawan", "tblgaji.ID_Karyawan", "tblkaryawan.ID_Karyawan")
            .whereIn("tblgaji.ID_Gaji", subQuery);

        const potonganResults = await BaseServiceQueryBuilder.fetchAll('tblpotongandetail', { ID_Potongan: '02' });

        for (const result of results) {
            let potonganTotal = 0;

            for (const potongan of potonganResults) {
                if (potongan.ID_Gaji === result.ID_Gaji && potongan.ID_Potongan === '02') {
                    potonganTotal += potongan.Jumlah_Potongan;
                }
            }

            result.Jumlah_potongan = potonganTotal;
        }


        const profilData = await BaseServiceQueryBuilder.fetchFirst(DATAPROFIL_CONFIG_TABLE);

        return {
            profilData,
            results
        };
    } catch (error) {
        console.error('Error generating PPH report for the period:', error);
        throw error;
    }
};

module.exports = PphServiceReportPeriod;
