const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('../passport/login');
});

router.get('/signup', (req, res, next) => {
  res.render('../passport/signup');
});

router.get('/private', (req, res, next) => {
  res.render('../passport/private');
});


module.exports = router;
