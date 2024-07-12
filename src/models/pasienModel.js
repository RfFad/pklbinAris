const pool = require('../configs/Databases');

const getPatients = async () => {
  const [rows] = await pool.query(`
    SELECT pasien_ralan.no_reg, pasien_ralan.no_pasien, pasien_ralan.tanggal, pasien_ralan.no_sjp, 
           pasien_ralan.nama_pasien AS nama_pasien, gol_pasien.keterangan AS gol_pasien
    FROM pasien_ralan
    INNER JOIN gol_pasien ON gol_pasien.id_gol = pasien_ralan.gol_pasien
    WHERE DATE(pasien_ralan.tanggal) >= '2024-07-05'
      AND DATE(pasien_ralan.tanggal) <= '2024-07-05'
      AND pasien_ralan.layan = 1
      AND gol_pasien.golpas = 'BPJS'
    ORDER BY pasien_ralan.no_reg DESC, pasien_ralan.no_pasien;
  `);
  return rows;
};

const getPatientCount = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS count
    FROM pasien_ralan
    INNER JOIN gol_pasien ON gol_pasien.id_gol = pasien_ralan.gol_pasien
    WHERE DATE(pasien_ralan.tanggal) >= '2024-07-05'
      AND DATE(pasien_ralan.tanggal) <= '2024-07-05'
      AND pasien_ralan.layan = 1
      AND gol_pasien.golpas = 'BPJS';
  `);
  return rows[0].count;
};

module.exports = { getPatients, getPatientCount };
