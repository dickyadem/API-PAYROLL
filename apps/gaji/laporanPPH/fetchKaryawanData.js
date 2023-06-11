const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'payroll',
    },
});

const fetchPotonganPPHData = async (ID_Gaji) => {
    try {
        // Mengambil data potongan PPH
        const potonganPPH = await knex('tblgajidetail')
            .where({ ID_Gaji: ID_Gaji, ID_Potongan: '02' })
            .select('ID_Gaji', 'ID_Karyawan', 'Jumlah_Potongan');

        // Mengambil data karyawan
        const karyawanIDs = potonganPPH.map((item) => item.ID_Karyawan);
        const karyawan = await knex('tblkaryawan')
            .whereIn('ID_Karyawan', karyawanIDs)
            .select('ID_Karyawan', 'Nama_Karyawan');

        // Menggabungkan data potongan PPH dengan data karyawan
        const potonganPPHData = potonganPPH.map((item) => {
            const karyawanData = karyawan.find((k) => k.ID_Karyawan === item.ID_Karyawan);
            return {
                ID_Gaji: item.ID_Gaji,
                ID_Karyawan: item.ID_Karyawan,
                Nama_Karyawan: karyawanData ? karyawanData.Nama_Karyawan : '',
                Jumlah_Potongan: item.Jumlah_Potongan,
            };
        });

        return potonganPPHData;
    } catch (error) {
        console.error('Error fetching potongan PPH data:', error);
        throw error;
    }
};

module.exports = fetchPotonganPPHData;
