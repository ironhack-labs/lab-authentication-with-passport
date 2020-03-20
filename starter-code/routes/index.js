const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {

  console.log('got to the homepage')
  res.render('index');
});

module.exports = router;
