const express = require('express');
const { showPatients } = require('../controllers/pasienController');
const router = express.Router();
const verifyUser = require('../configs/verify');
// GET menu utama page
router.get('/',verifyUser.isLogin, showPatients);

module.exports = router;
