var express = require('express');
var router = express.Router();
const passport = require("passport")


// router.use((req, res, next) => {
//   if (req.session.user) {
//     res.redirect('/private-page');
//   }
// });

router.get('/', function(req, res, next) {
  res.render('passport/signup');
});

router.get('/login', function(req, res, next) {
  res.render('passport/login');
});

module.exports = router;
