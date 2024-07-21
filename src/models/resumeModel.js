const pool = require('../configs/Databases');


const getResume = async (no_rm, page, offset) => {
  const data = {
    ralan: {},
    igd: {},
    radioterapi: {},
    terapi: {},
    kasir: {
      ralan: {},
      lab: {},
      rad: {},
    },
    grouper_icd9: {},
    grouper_icd10: {}
  };

  // Query to get patient details
  const [patients] = await pool.query(`
    SELECT pr.no_reg, pr.no_pasien, pr.layan, pr.dokter_poli, pr.tujuan_poli, pr.tanggal, p.keterangan as nama_poli, d.nama_dokter
    FROM pasien_ralan pr
    INNER JOIN poliklinik p ON pr.tujuan_poli = p.kode
    LEFT JOIN dokter d ON d.id_dokter = pr.dokter_poli
    WHERE pr.no_pasien = ?
      AND pr.layan != 2
    ORDER BY pr.tanggal DESC
    LIMIT ?, ?
  `, [no_rm, offset, page]);

  for (const row of patients) {
    data.ralan[row.no_reg] = row;

    // Query to get IGD details
    const [igdDetails] = await pool.query(`
      SELECT pi.no_reg, pi.a, pi.riwayat_alergi
      FROM pasien_igd pi
      WHERE pi.no_reg = ?
    `, [row.no_reg]);
    if (igdDetails.length > 0) {
      data.igd[row.no_reg] = igdDetails[0];
    }

    // Query to get radiotherapy details
    const [radioterapiDetails] = await pool.query(`
      SELECT pi.no_reg, pi.dokter, d.nama_dokter
      FROM pasien_radioterapi pi
      INNER JOIN dokter d ON d.id_dokter = pi.dokter
      WHERE pi.no_reg = ?
    `, [row.no_reg]);
    if (radioterapiDetails.length > 0) {
      data.radioterapi[row.no_reg] = radioterapiDetails[0];
    }

    // Query to get therapy details
    const [terapiDetails] = await pool.query(`
      SELECT a.no_reg, a.nama_obat, a.qty, a.satuan, ap.nama as aturan_pakai
      FROM apotek a
      LEFT JOIN aturan_pakai ap ON ap.kode = a.aturan_pakai
      WHERE a.no_reg = ?
    `, [row.no_reg]);
    if (terapiDetails.length > 0) {
      data.terapi[row.no_reg] = terapiDetails;
    }

    // Query to get outpatient treatments
    const [ralanKasirDetails] = await pool.query(`
      SELECT k.no_reg, k.kode_tarif, tr.nama_tindakan
      FROM kasir k
      INNER JOIN tarif_ralan tr ON tr.kode_tindakan = k.kode_tarif
      WHERE k.no_reg = ?
        AND k.kode_tarif != 'FRM'
    `, [row.no_reg]);
    if (ralanKasirDetails.length > 0) {
      data.kasir.ralan[row.no_reg] = ralanKasirDetails;
    }

    // Query to get lab results
    const [labKasirDetails] = await pool.query(`
      SELECT k.no_reg, k.kode_tarif, l.nama as nama_tindakan, e.hasil
      FROM kasir k
      INNER JOIN tarif_lab tl ON tl.kode_tindakan = k.kode_tarif
      INNER JOIN lab_normal l ON l.kode_tindakan = tl.kode_tindakan
      INNER JOIN ekspertisi_lab e ON e.no_reg = k.no_reg AND e.kode_tindakan = k.kode_tarif AND e.kode_labnormal = l.kode
      WHERE k.no_reg = ?
        AND k.kode_tarif != 'FRM'
      GROUP BY l.kode_tindakan, l.kode
    `, [row.no_reg]);
    if (labKasirDetails.length > 0) {
      data.kasir.lab[row.no_reg] = labKasirDetails;
    }

    // Query to get radiology results
    const [radKasirDetails] = await pool.query(`
      SELECT k.no_reg, k.kode_tarif, tra.nama_tindakan as nama_tindakan, e.hasil_pemeriksaan as hasil
      FROM kasir k
      INNER JOIN tarif_radiologi tra ON tra.id_tindakan = k.kode_tarif
      INNER JOIN ekspertisi e ON e.no_reg = k.no_reg AND e.id_tindakan = k.kode_tarif
      WHERE k.no_reg = ?
        AND k.kode_tarif != 'FRM'
    `, [row.no_reg]);
    if (radKasirDetails.length > 0) {
      data.kasir.rad[row.no_reg] = radKasirDetails;
    }

    // Query to get ICD-9 codes
    const [icd9Details] = await pool.query(`
      SELECT g.no_reg, g.kode
      FROM grouper_ralan_icd9 g
      WHERE g.no_reg = ?
    `, [row.no_reg]);
    if (icd9Details.length > 0) {
      data.grouper_icd9[row.no_reg] = icd9Details;
    }

    // Query to get ICD-10 codes
    const [icd10Details] = await pool.query(`
      SELECT g.no_reg, g.kode
      FROM grouper_ralan_icd10 g
      WHERE g.no_reg = ?
    `, [row.no_reg]);
    if (icd10Details.length > 0) {
      data.grouper_icd10[row.no_reg] = icd10Details;
    }
  }

  return data;
};

module.exports = { getResume };
