const express = require('express');
const router = express.Router();

const passport = require("passport");

// Require user model
const User = require("../models/User.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport

const ensureLogin = require("connect-ensure-login");

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});


//sign up functionality iteration 1

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimun.'
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', { message: 'Your username cannot be empty' });
    return;
  }
  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render('auth/signup', { message: 'This username is already taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          req.login(dbUser, err => {
            if (err) {
              next(err);
            } else {
              res.redirect('/');
            }
          })
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

//login functionality iteration 2

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post(
  '/login',
  passport.authenticate('local', {
    // here you can add your own routes 
    successRedirect: '/private-page',
    failureRedirect: '/login',
    // this is set
    failureFlash: true,
    passReqToCallback: true
  })
);
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
