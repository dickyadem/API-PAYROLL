const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const {
    GAJI_CONFIG_MAIN_TABLE,
    GAJIDETAIL_CONFIG_MAIN_TABLE
} = require("../config");
const knex = require('knex')({
    client: "mysql",
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "payroll",
    },
});

const GajiServiceCreate = async (
    ID_Gaji,
    Tanggal,
    ID_Karyawan,
    Total_Pendapatan,
    Total_Potongan,
    Gaji_Bersih,
    Keterangan,
    email,
    ID_Profil,
    items
) => {
    const dataGaji = {
        ID_Gaji,
        Tanggal,
        ID_Karyawan,
        Total_Pendapatan,
        Total_Potongan,
        Gaji_Bersih,
        Keterangan,
        email,
        ID_Profil
    };

    const dataItemGaji = items.map((item) => {
        return {
            ID_Pendapatan: item.ID_Pendapatan,
            Jumlah_Pendapatan: item.Jumlah_Pendapatan,
            ID_Potongan: item.ID_Potongan,
            Jumlah_Potongan: item.Jumlah_Potongan
        };
    });

    await knex.transaction(async (trx) => {
        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .insert(dataGaji)
            .transacting(trx);

        await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
            .insert(dataItemGaji)
            .transacting(trx);

        const totalPotonganQuery = knex(GAJIDETAIL_CONFIG_MAIN_TABLE).sum('Jumlah_Potongan as Total_Potongan');
        const totalPendapatanQuery = knex(GAJIDETAIL_CONFIG_MAIN_TABLE).sum('Jumlah_Pendapatan as Total_Pendapatan');

        const [totalPotonganResult, totalPendapatanResult] = await Promise.all([
            totalPotonganQuery.transacting(trx),
            totalPendapatanQuery.transacting(trx)
        ]);

        const Total_Potongan = totalPotonganResult[0].Total_Potongan || 0;
        const Total_Pendapatan = totalPendapatanResult[0].Total_Pendapatan || 0;
        const Gaji_Bersih = Total_Pendapatan - Total_Potongan;

        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .update({ Total_Potongan, Total_Pendapatan, Gaji_Bersih })
            .where({ ID_Gaji })
            .transacting(trx);
    });

    return { ...dataGaji, items: dataItemGaji };
};

module.exports = GajiServiceCreate;
