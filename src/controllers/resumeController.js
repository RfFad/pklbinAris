const { getResume } = require('../models/resumeModel');

const verifyResume = async (req, res) => {
  try {
    const no_rm = req.params.no_rm; // Assuming the route provides no_rm
    const page = parseInt(req.query.page) || 1;
    const offset = 10;

    const data = await getResume(no_rm, page, offset);

    // Pagination logic
    const totalRecords = Object.keys(data.ralan).length; // Adjust this if you have total records from your DB
    const totalPages = Math.ceil(totalRecords / offset);
    const from = (page - 1) * offset;
    
    const createPaginationLinks = (currentPage, totalPages) => {
      let links = '';
      for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
          links += `<li class="active"><span>${i}</span></li>`;
        } else {
          links += `<li><a href="?page=${i}">${i}</a></li>`;
        }
      }
      return `<ul class="pagination">${links}</ul>`;
    };

    res.render('ralan/resume', {
      q1: data,
      data: data,
      from: from,
      print: req.query.print || '0',
      paginationLinks: createPaginationLinks(page, totalPages),
      baseUrl: 'your_base_url_here', // Adjust with your actual base URL
      siteUrl: 'your_site_url_here' // Adjust with your actual site URL
    });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { verifyResume };
