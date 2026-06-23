const knex = require('../../base/db');

const fetchKaryawanData = async (ID_Karyawan) => {
    try {
        const karyawan = await knex('tblkaryawan').where('ID_Karyawan', ID_Karyawan).first();
        return karyawan;
    } catch (error) {
        console.error('Error fetching karyawan data:', error);
        throw error;
    }
};




module.exports = fetchKaryawanData;