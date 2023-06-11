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

const fetchPotonganBPJSData = async (ID_Gaji) => {
    try {
        // Mengambil data potongan BPJS
        const potonganBPJS = await knex('tblgajidetail')
            .where({ ID_Gaji: ID_Gaji, ID_Potongan: '01' })
            .select('ID_Gaji', 'ID_Karyawan', 'Jumlah_Potongan');

        // Mengambil data karyawan
        const karyawanIDs = potonganBPJS.map((item) => item.ID_Karyawan);
        const karyawan = await knex('tblkaryawan')
            .whereIn('ID_Karyawan', karyawanIDs)
            .select('ID_Karyawan', 'Nama_Karyawan');

        // Mengambil data dari tblprofil
        const profilData = await knex('tblprofil')
            .select('Nama', 'Alamat', 'Telepon', 'Fax', 'Email', 'Website')
            .first();

        // Menggabungkan data potongan BPJS dengan data karyawan
        const potonganBPJSData = potonganBPJS.map((item) => {
            const karyawanData = karyawan.find((k) => k.ID_Karyawan === item.ID_Karyawan);
            return {
                ID_Gaji: item.ID_Gaji,
                ID_Karyawan: item.ID_Karyawan,
                Nama_Karyawan: karyawanData ? karyawanData.Nama_Karyawan : '',
                Jumlah_Potongan: item.Jumlah_Potongan,
            };
        });

        return {
            potonganBPJSData,
            profilData,
        };
    } catch (error) {
        console.error('Error fetching potongan BPJS data:', error);
        throw error;
    }
};

module.exports = fetchPotonganBPJSData;
