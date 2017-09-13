var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.user){
  res.render('passport/home-user.ejs');
  }

  // not logged in
  else {
  // check for feedback messages from the sign up process
  res.locals.signupFeedback = req.flash('signupSuccess');
  res.render('index', { title: 'Express' });
  // res.render('index');

  }
});

module.exports = router;
