const { getResume } = require('../models/resumeModel');

const verifyResume = async (req, res) => {
  try {
    const no_rm = req.params.no_rm; // Assuming the route provides no_rm
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 4; // Records per page
    const offset = (page - 1) * limit;

    // Fetch resume data with limit and offset
    const { data, totalRecords } = await getResume(no_rm, limit, offset);
    const totalPages = Math.ceil(totalRecords / limit);

    res.render('ralan/resume', {
      data: data,
      q1: data.pasien[Object.keys(data.pasien)[0]] || {}, // Adjust based on your actual data structure
      currentPage: page,
      totalPages: totalPages,
      print: req.query.print || '0',
      baseUrl: 'your_base_url_here', // Adjust with your actual base URL
      siteUrl: 'your_site_url_here' // Adjust with your actual site URL
    });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { verifyResume };
