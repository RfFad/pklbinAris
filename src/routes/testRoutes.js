const express = require('express');
const router = express.Router();
const db = require('../configs/Databases'); // Adjust the path to your db connection

router.get('/getlistobat/:no_rm/:no_reg', async (req, res) => {
    const { no_rm, no_reg } = req.params;
    try {
        // Fetch patient data
        const patientQuery = 'SELECT * FROM pasien WHERE no_pasien = ?';
        const [patient] = await db.query(patientQuery, [no_rm]);

        if (patient.length > 0) {
            const q = patient[0];
            const lahir = new Date(q.tgl_lahir);
            const hariIni = new Date();
            const diff = new Date(hariIni - lahir);
            const umur = diff.getUTCFullYear() - 1970 + " Tahun";

            const masterData = {
                master: q,
                umur: umur
            };

            // Fetch detail data
            const detailQuery = `
                SELECT pr.no_reg, p.keterangan as ruangan, d.id_dokter, d.nama_dokter, d.no_sip 
                FROM pasien_ralan pr
                INNER JOIN dokter d ON d.id_dokter = pr.dokter_poli
                INNER JOIN poliklinik p ON p.kode = pr.tujuan_poli
                WHERE pr.no_reg = ?
            `;
            const [detail] = await db.query(detailQuery, [no_reg]);

            if (detail.length > 0) {
                masterData.detail = detail[0];
            }

            // Fetch obat data
            const obatQuery = `
                SELECT apotek.*, a.nama as aturan 
                FROM apotek 
                LEFT JOIN aturan_pakai a ON a.kode = apotek.aturan_pakai 
                WHERE apotek.no_reg = ?
            `;
            const [obat] = await db.query(obatQuery, [no_reg]);

            // Fetch racikan data
            const racikanQuery = 'SELECT * FROM racikan WHERE id_racikan = ?';
            const [racikan] = await db.query(racikanQuery, [no_reg]);

            // Fetch diagnosa and dokter data
            const diagnosaQuery = 'SELECT * FROM pasien_igd WHERE no_reg = ?';
            const [diagnosa] = await db.query(diagnosaQuery, [no_reg]);
            if (diagnosa.length > 0) {
                masterData.diagnosa = diagnosa[0];
                masterData.p_dokter = diagnosa[0];
            }

            res.render('Ralan/eResep', { data: masterData, obat: obat, racikan: racikan });
        } else {
            res.status(404).send("Patient not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
