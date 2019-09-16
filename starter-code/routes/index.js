const express = require('express');
const router  = express.Router();
const passRoutes = require('./passportRouter');


router.use('/', passRoutes);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
