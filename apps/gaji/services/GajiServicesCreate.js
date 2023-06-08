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
    const isExistingGaji = await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
        .where({ ID_Gaji, Tanggal })
        .first();

    if (isExistingGaji) {
        throw new Error('ID_Gaji dan tanggal already exist');
    }

    const existingPendapatanQuery = await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
        .where({ ID_Gaji })
        .sum('Jumlah_Pendapatan as Total_Pendapatan')
        .first();

    const existingPotonganQuery = await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
        .where({ ID_Gaji })
        .sum('Jumlah_Potongan as Total_Potongan')
        .first();

    const existingPendapatan = existingPendapatanQuery.Total_Pendapatan || 0;
    const existingPotongan = existingPotonganQuery.Total_Potongan || 0;

    const dataItemGaji = items.map((item) => {
        const Jumlah_Pendapatan = item.Jumlah_Pendapatan || 0;
        const Jumlah_Potongan = item.Jumlah_Potongan || 0;

        return {
            ID_Gaji,
            ID_Pendapatan: item.ID_Pendapatan,
            Jumlah_Pendapatan: existingPendapatan + Jumlah_Pendapatan,
            ID_Potongan: item.ID_Potongan,
            Jumlah_Potongan: existingPotongan + Jumlah_Potongan
        };
    });

    await BaseServiceQueryBuilder.transaction(async (trx) => {
        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .insert(dataGaji)
            .transacting(trx);

        await BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
            .insert(dataItemGaji)
            .transacting(trx);

        const totalPotonganQuery = BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
            .where({ ID_Gaji })
            .sum('Jumlah_Potongan as Total_Potongan')
            .first();

        const totalPendapatanQuery = BaseServiceQueryBuilder(GAJIDETAIL_CONFIG_MAIN_TABLE)
            .where({ ID_Gaji })
            .sum('Jumlah_Pendapatan as Total_Pendapatan')
            .first();

        const [totalPotonganResult, totalPendapatanResult] = await Promise.all([
            totalPotonganQuery.transacting(trx),
            totalPendapatanQuery.transacting(trx)
        ]);

        const Total_Potongan = totalPotonganResult.Total_Potongan || 0;
        const Total_Pendapatan = totalPendapatanResult.Total_Pendapatan || 0;
        const Gaji_Bersih = Total_Pendapatan - Total_Potongan;

        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .update({ Total_Potongan, Total_Pendapatan, Gaji_Bersih })
            .where({ ID_Gaji })
            .transacting(trx);
    });

    return { ...dataGaji, items: dataItemGaji };
};


module.exports = GajiServiceCreate;
