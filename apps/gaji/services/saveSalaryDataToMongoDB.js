const { MongoClient } = require("mongodb");

// Konfigurasi koneksi ke database MongoDB
const uri = "mongodb://localhost:27017";
const dbName = "payroll";

// Fungsi untuk menyimpan data penggajian ke koleksi MongoDB
const saveSalaryDataToMongoDB = async (salaryData) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("laporan_penggajian");
        await collection.insertMany(salaryData);
        console.log("Data penggajian berhasil disimpan ke MongoDB");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
};

module.exports = saveSalaryDataToMongoDB;