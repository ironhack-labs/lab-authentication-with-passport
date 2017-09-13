var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.success = req.flash('successful');
  res.render('index', { title: 'Express' });
});

module.exports = router;
