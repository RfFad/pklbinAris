const express = require('express');
const router = express.Router();
const { verifyResume } = require('../controllers/resumeController');

router.get('/resume/:no_rm', verifyResume);

module.exports = router;
