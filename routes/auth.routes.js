const express = require('express'),
  router = express.Router(),
  chalkAnimation = require('chalk-animation'),
  app = express(),
  crypt = require("bcrypt")
;
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');
//Add a new GET route to your routes/auth.routes.js file with the path /signup and point it to your views/auth/signup.hbs file.
router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});
// dd a POST route to your routes/auth.routes.js to receive the data from the signup form and create a new user with the data.
router.post('/signup', (req, res) => {
  // console.log(req.body);
  const  { username, password} = req.body
  console.log(username, password);
  res.render('auth/signup', { username, password});
  // console.log(user);
});


router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', (req, res) => {
  // console.log(req.body);
  const  { username, password} = req.body
  console.log(username, password);
  res.render('login', { username, password});
  // console.log(user);
});

module.exports = router;

// app.listen(3000, () => chalkAnimation.rainbow('running on port 3000  🔊'));
