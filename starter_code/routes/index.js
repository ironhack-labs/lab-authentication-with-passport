const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/passport/login', (req, res, next) => {
  res.render('passport/login');
});

router.get('/passport/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.get('/passport/private', (req, res, next) => {
  res.render('passport/private');
});


module.exports = router;
