const express = require('express');
const { showPatients } = require('../controllers/pasienController');
const router = express.Router();
const verifyUser = require('../configs/verify');
const authHeader = require('../configs/jwtMiddleware');  // assuming authHeader is another middleware
const verifyAndRefreshToken = require('../configs/jwtMiddleware');

router.use(verifyAndRefreshToken);
// Route to fetch resume data by no_reg
router.get('/', showPatients,verifyUser.isLogin,authHeader);

module.exports = router;
