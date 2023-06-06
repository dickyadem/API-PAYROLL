const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { GAJI_CONFIG_MAIN_TABLE } = require("../config");

const GajiServiceCreate = async (
    ID_Gaji,
    Tanggal,
    ID_Karyawan,
    Total_Pendapatan,
    Total_Potongan,
    Keterangan,
    Gaji_Bersih,
    email,
    ID_Profil
) => {
    const dataGaji = {
        ID_Gaji,
        Tanggal,
        ID_Karyawan,
        Total_Pendapatan,
        Total_Potongan,
        Keterangan,
        Gaji_Bersih,
        email,
        ID_Profil
    };



    await BaseServiceQueryBuilder.transaction(async (trx) => {
        await BaseServiceQueryBuilder(GAJI_CONFIG_MAIN_TABLE)
            .insert(dataGaji)
            .transacting(trx);
    });


    return { ...dataGaji };
};

module.exports = GajiServiceCreate;
