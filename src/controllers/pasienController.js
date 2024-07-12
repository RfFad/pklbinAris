const { getPatients, getPatientCount } = require('../models/pasienModel');

const showPatients = async (req, res) => {
  try {
    const patients = await getPatients();
    const patientcounts = await getPatientCount();
    res.render('Ralan/index', { patients, patientcounts,
      userName: req.session.username,
     });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { showPatients };
