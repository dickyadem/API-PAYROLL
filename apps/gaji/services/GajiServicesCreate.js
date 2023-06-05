const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const {
    GAJI_CONFIG_MAIN_TABLE,
    GAJI_CONFIG_ITEM_BELI_TABLE,
} = require("../config");

const GajiServiceCreate = async (
    ID_Gaji,
    Tanggal,
    ID_Karyawan,
    Total_Pendapatan,
    Total_Potongan,
    Gaji_Bersih,
    items
) => {
    const dataGaji = {
        ID_Gaji,
        Tanggal,
        ID_Karyawan,
        Total_Pendapatan,
        Total_Potongan,
        Gaji_Bersih,
    };

    const dataItemGaji = items.map((item) => {
        return {
            faktur,
            ID_Pendapatan: item.ID_Pendapatan,
            Nama_Pendapatan: item.Nama_Pendapatan,
            Jumlah_Pendapatan: item.Jumlah_Pendapatan,
            ID_Potongan: item.ID_Potongan,
            Nama_Potongan: item.Nama_Potongan,
            Jumlah_Potongan: item.Jumlah_Potongan
        };
    });

    await BaseServiceQueryBuilder.transaction(async (trx) => {
        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .insert(dataGaji)
            .transacting(trx);

        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .insert(dataItemGaji)
            .transacting(trx);
    });

    return { ...dataGaji, items: dataItemGaji };
};

module.exports = GajiServiceCreate;
