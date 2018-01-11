const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('passport/signup', {
    message: "Welcome to the jungle!"
  });
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === '') {
    res.render('passport/signup', { message: "Did you filled the fields?" });
    next(err);
  };

  User.findOne({ username }, "username", (err, user) => {
    if (user) {
      res.render('passport/signup', { message: "User already exists, try again!" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render('passport/signup');
      }
      else {
        res.redirect('/');
      }
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('passport/login', { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = router;
