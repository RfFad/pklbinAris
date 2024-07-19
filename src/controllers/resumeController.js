const { getResume } = require('../models/resumeModel');

const verifyPatient = async (req, res) => {
  try {
    const { no_reg } = req.params;
    const page = 0; // assuming a default page value
    const offset = 10; // assuming a default offset value

    // Fetch resume data for the given no_reg
    const resumeData = await getResume(no_reg, page, offset);

    // Render the data to a view
    res.render('Ralan/resume', { resumeData });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { verifyPatient };
