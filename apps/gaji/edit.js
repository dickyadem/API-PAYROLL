// Get the ID_Gaji from tblgaji
const ID_Gaji = tblgaji[0].ID_Gaji;

// Filter tblgajidetail based on the ID_Gaji
const gajiDetails = tblgajidetail.filter(item => item.ID_Gaji === ID_Gaji);

// Calculate Total_Jumlah
const totalJumlah = gajiDetails.reduce((total, item) => {
  return total + item.Jumlah_Potongan;
}, 0);

// Display Total_Jumlah
const totalJumlahRow = tblpotongan.length + 8;
ws.getCell(`C${totalJumlahRow}`).value = 'Total_Jumlah';
ws.getCell(`D${totalJumlahRow}`).value = totalJumlah;
ws.getCell(`D${totalJumlahRow}`).font = { bold: true };