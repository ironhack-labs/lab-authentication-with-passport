var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    successMessage: req.flash('success')
  });
});


module.exports = router;
