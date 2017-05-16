const express    = require("express");
const bcrypt     = require('bcrypt');
const passport   = require('passport');
const User       = require("../models/user-model.js");
const ensure     = require('connect-ensure-login');

const authRoutes = express.Router();

//****************************************************************************
// Route 1 -> get signup
authRoutes.get("/signup", 
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
    res.render("auth/signup-view.ejs");
});

//****************************************************************************
// Route 2 -> post signup
authRoutes.post("/signup", 
  ensure.ensureNotLoggedIn('/'),

  (req, res, next) => {
    const signupFirstName  = req.body.signupFirstName;
    const signupLastName   = req.body.signupLastName;
    const signupUsername   = req.body.signupUsername;
    const signupPassword   = req.body.signupPassword;

  // check username and password were given don't let user submit blank data
  if ( signupFirstName === '' || signupLastName === '' || signupUsername === '' || signupPassword === '') {
    res.render("auth/signup-view.ejs", 
      { errorMessage: "Please, Provide username and password" }
    );
    return;
  }

  // check if the username was already create reading in db
  User.findOne(
    { username : signupUsername },
    { username : 1 },
    (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    // if username is found don't let the user signup
    if (foundUser) {
      res.render("auth/signup-view.ejs", 
        { errorMessage: "Username is not available"}
      );
      return;
    }
    // if reach this point -> we are good to create account
    // 1. - encrypt password with bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(signupPassword, salt);

    // 2. - create the user
    const theUser = new User({
      firstName          : signupFirstName,
      lastName           : signupLastName,
      username           : signupUsername,
      encryptedPassword  : hashPass
    });

    // 3. - Save the new user in db
    theUser.save((err) => {
      if (err) {
        next(err);
        return;
      }
      // flash message
      req.flash( 'success', 'You have registered successfully!' );

      // then redirect to login page
      res.redirect('/');
    });
  });
});

//****************************************************************************
// Route 3 -> login page
authRoutes.get("/login", 
  ensure.ensureNotLoggedIn('/'),

  (req, res, next) => {
    res.render("auth/login-view.ejs", 
      { errorMessage: req.flash('error') }
    );
});

//****************************************************************************
// Route 4 -> post login
authRoutes.post('/login',
  passport.authenticate('local', 
    { 
      successRedirect: '/user-home',
      successFlash: true,
      failureRedirect: '/login',
      failureFlash: true       
    }
  )
);

//****************************************************************************
// Route 5 -> log out
authRoutes.get('/logout', (req, res, next) => {
  // req.logout() method is provided by passport
  req.logout();
  req.flash('success', 'You have logged out successful');
  res.redirect('/');
});

//****************************************************************************
// Route 6 -> facebook login
authRoutes.get('/auth/facebook', passport.authenticate('facebook'));
authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/user-home',
  failureRedirect: '/login'
}));

//****************************************************************************
// Route 7 -> google login
authRoutes.get('/auth/google', passport.authenticate('google', {
  scope: [ "https://www.googleapis.com/auth/plus.login",
           "https://www.googleapis.com/auth/plus.profile.emails.read" ]
}));
authRoutes.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/user-home',
  failureRedirect: '/login'
}));







module.exports = authRoutes;