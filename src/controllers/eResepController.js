const obatModel = require('../models/eResepModel');

const getListObat = async (req, res) => {
    const { no_rm, no_reg } = req.params;
    try {
        const patient = await obatModel.getPatient(no_rm);

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

            const detail = await obatModel.getDetail(no_reg);
            if (detail.length > 0) {
                masterData.detail = detail[0];
            }

            const obat = await obatModel.getObat(no_reg);
            const racikan = await obatModel.getRacikan(no_reg);
            const diagnosa = await obatModel.getDiagnosa(no_reg);

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
};

module.exports = {
    getListObat
};
