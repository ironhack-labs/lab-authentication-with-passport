const express = require('express');
const router = express.Router();

// Require user model
const User = require('../models/User.model');


// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


// Add passport
const passport = require('passport')
const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

// --------------------- START Signup
// Routes for signup, GET and POST
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
});

router.post('/signup', (req, res, next) => {

  // require bcrypt salt and hashpass
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  let user = new User({ username: req.body.username, password: hashPass })
  user.save().then(() => {
    res.send('user successfully created')
  })
});

// --------------------- END Signup

// --------------------- START Login
// Routes for login, GET and POST
router.get('/login', (req, res, next) => {
  res.render('auth/login')
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/login',
  failureFlash: true,
  // passReqToCallback: true
}));
  // IMPORTANT LEARNING: do use passport.authenticate, just a res.send does not store anything
  // res.send('login successful')
// --------------------- END Login

// --------------------- START Private Page
router.get('/private', (req, res, next) => {
  // console.log(req.user)
  // check if user is logged in
  if (req.user) {
    // pass in the user as object and req.user
    res.render('auth/private', {user: req.user})
  }
  else {
    //req.flash('error', 'you have to belogged in')
    res.send('sorry, you are not logged in yet')
  }
})
// --------------------- END Private Page


// --------------------- START Github Login
router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login" // here you would navigate to the classic login page
  })
);
// --------------------- END Github Login

router.get('/logout', (req, res) => {
  req.logout() // this one deletes user from the session
  res.render('auth/logout');
})


module.exports = router;
