const express = require('express');
const {antrianPasien} = require ('../controllers/antrianController');
const router = express.Router();

// GET menu utama page
router.get('/', antrianPasien)

module.exports  =router;
