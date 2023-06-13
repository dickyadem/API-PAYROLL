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

const fetchAllByCondition = async (table, condition) => {
    try {
        const records = await knex(table).where(condition);
        return records;
    } catch (error) {
        console.error(`Error fetching data from ${table} with condition:`, condition);
        throw error;
    }
};

const fetchByID = async (tblgaji, ID_Gaji) => {
    try {
        const tblgajiRecord = await knex(tblgaji).where({ ID_Gaji }).first();

        if (!tblgajiRecord) {
            throw new Error(`No record found for ${tblgaji} with ID ${ID_Gaji}`);
        }

        const ID_Karyawan = tblgajiRecord.ID_Karyawan;

        const tblkaryawan = await fetchAllByCondition('tblkaryawan', { ID_Karyawan });

        const tblgajidetail = await fetchAllByCondition('tblgajidetail', { ID_Gaji });

        const tblgolongan = await fetchAllByCondition('tblgolongan', { ID_Karyawan });

        const tbljabatan = await fetchAllByCondition('tbljabatan', { ID_Karyawan });

        const idPendapatanList = tblgajidetail.map((detail) => detail.ID_Pendapatan);

        const tblpendapatan = await fetchAllByCondition('tblpendapatan', { ID_Pendapatan: idPendapatanList });

        const tblpotongan = await fetchAllByCondition('tblpotongan', { ID_Potongan: idPendapatanList });

        return {
            tblgaji: tblgajiRecord,
            tblkaryawan,
            tblgajidetail,
            tblgolongan,
            tbljabatan,
            tblpendapatan,
            tblpotongan,
        };
    } catch (error) {
        console.error(`Error mengambil data dari ${tblgaji} dengan ID ${ID_Gaji}:`, error);
        throw error;
    }
};

module.exports = {
    fetchAllByCondition,
    fetchByID,
};