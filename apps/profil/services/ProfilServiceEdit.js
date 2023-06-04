const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PROFIL_CONFIG_MAIN_TABLE } = require("../config");

const ProfilServiceEdit = async (
    ID_Profil,
    Nama,
    Alamat,
    Telepon,
    Fax,
    Email,
    Website
) => {
  const data = {
    ID_Profil,
    Nama,
    Alamat,
    Telepon,
    Fax,
    Email,
    Website
  };

  await BaseServiceQueryBuilder(PROFIL_CONFIG_MAIN_TABLE)
    .where({ ID_Profil })
    .update(data);

  return { ID_Profil, ...data };
};

module.exports = ProfilServiceEdit;
