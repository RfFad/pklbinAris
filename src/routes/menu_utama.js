const express = require('express');
const verifyUser = require('../configs/verify');
const authHeader = require('../configs/jwtMiddleware');  // assuming authHeader is another middleware
const verifyAndRefreshToken = require('../configs/jwtMiddleware');
const router = express.Router();

// Use verifyAndRefreshToken middleware for all routes
router.use(verifyAndRefreshToken);

// GET menu utama page
router.get('/', verifyUser.isLogin, authHeader, (req, res) => {
  res.render('menu_utama', { title: 'Menu Utama' });
});

module.exports = router;
