const xl = require('exceljs');
const knexInstance = require('../../base/db');
const { GAJI_CONFIG_MAIN_TABLE } = require('../config');
const BaseServiceQueryBuilder = require('../../base/services/BaseServiceQueryBuilder');

const BPJSServiceGetSlip = async () => {
    try {
        const gajiResults = await knexInstance(GAJI_CONFIG_MAIN_TABLE).select('*');
        const karyawanResults = await knexInstance('tblkaryawan').select('*');
        const potonganResults = await knexInstance('tblpotongandetail').where({ ID_Potongan: '02' }).select('*');

        const slips = [];

        for (const gaji of gajiResults) {
            const slip = {
                ID_Gaji: gaji.ID_Gaji,
                ID_Karyawan: gaji.ID_Karyawan,
                Nama_Karyawan: '',
                Jumlah_potongan: 0
            };

            const karyawan = karyawanResults.find(k => k.ID_Karyawan === gaji.ID_Karyawan);
            if (karyawan) {
                slip.Nama_Karyawan = karyawan.Nama_Karyawan;
            }

            const potonganTotal = potonganResults.reduce((total, potongan) => total + potongan.Jumlah_Potongan, 0);
            slip.Jumlah_potongan = potonganTotal;

            slips.push(slip);
        }

        return slips;
    } catch (error) {
        console.error('Error fetching slip data:', error);
        throw error;
    }
};

module.exports = BPJSServiceGetSlip;
