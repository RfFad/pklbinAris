const express = require('express');
const verifyUser = require('../configs/verify');
const router = express.Router();

// GET menu utama page
router.get('/', verifyUser.isLogin, (req, res) => {
  res.render('menu_utama', { title: 'Menu Utama' });
});


module.exports=router
