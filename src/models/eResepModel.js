const db = require('../configs/Databases'); // Adjust the path to your db connection

const getPatient = async (no_rm) => {
    const patientQuery = 'SELECT * FROM pasien WHERE no_pasien = ?';
    const [patient] = await db.query(patientQuery, [no_rm]);
    return patient;
};

const getDetail = async (no_reg) => {
    const detailQuery = `
        SELECT pr.no_reg, p.keterangan as ruangan, d.id_dokter, d.nama_dokter, d.no_sip 
        FROM pasien_ralan pr
        INNER JOIN dokter d ON d.id_dokter = pr.dokter_poli
        INNER JOIN poliklinik p ON p.kode = pr.tujuan_poli
        WHERE pr.no_reg = ?
    `;
    const [detail] = await db.query(detailQuery, [no_reg]);
    return detail;
};

const getObat = async (no_reg) => {
    const obatQuery = `
        SELECT apotek.*, a.nama as aturan 
        FROM apotek 
        LEFT JOIN aturan_pakai a ON a.kode = apotek.aturan_pakai 
        WHERE apotek.no_reg = ?
    `;
    const [obat] = await db.query(obatQuery, [no_reg]);
    return obat;
};

const getRacikan = async (no_reg) => {
    const racikanQuery = 'SELECT * FROM racikan WHERE id_racikan = ?';
    const [racikan] = await db.query(racikanQuery, [no_reg]);
    return racikan;
};

const getDiagnosa = async (no_reg) => {
    const diagnosaQuery = 'SELECT * FROM pasien_igd WHERE no_reg = ?';
    const [diagnosa] = await db.query(diagnosaQuery, [no_reg]);
    return diagnosa;
};

module.exports = {
    getPatient,
    getDetail,
    getObat,
    getRacikan,
    getDiagnosa
};
