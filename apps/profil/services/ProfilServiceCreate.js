const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PROFIL_CONFIG_MAIN_TABLE } = require("../config");

const ProfilServiceCreate = async (
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

    await BaseServiceQueryBuilder(PROFIL_CONFIG_MAIN_TABLE).insert(data);

    return data;
};

module.exports = ProfilServiceCreate;
