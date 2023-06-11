const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_MAIN_TABLE, DATAPROFIL_CONFIG_TABLE } = require("../config");

const BPJSServiceReportPeriod = async (startDate, endDate) => {
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

        const potonganResults = await BaseServiceQueryBuilder.fetchAll('tblgajidetail', { ID_Potongan: '02' });

        for (const result of results) {
            const potonganTotal = potonganResults.reduce((total, potongan) => {
                if (potongan.ID_Gaji === result.ID_Gaji) {
                    return total + potongan.Jumlah_Potongan;
                }
                return total;
            }, 0);
            result.Jumlah_potongan = potonganTotal;
        }

        const profilData = await BaseServiceQueryBuilder.fetchFirst(DATAPROFIL_CONFIG_TABLE);

        return {
            profilData,
            results
        };
    } catch (error) {
        console.error('Error generating BPJS report for the period:', error);
        throw error;
    }
};

module.exports = BPJSServiceReportPeriod;
