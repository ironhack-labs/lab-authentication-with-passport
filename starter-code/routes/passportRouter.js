const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
var auth    = require('../helpers/auth');

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});


router.post("/signup", (req, res) => {

  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    req.flash('error', 'Indicate username and password');
    res.render("passport/signup", { "message": req.flash("error") });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      req.flash('error', 'The username already exists');
      res.render("passport/signup", { message: req.flash("error") });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        req.flash('error', 'The username already exists');
        res.render("passport/signup", { message: req.flash('error') });
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect('/private-page');
        });
      }
    });
  });

});


router.get("/login", (req, res) => {
  res.render("passport/login", { "message": req.flash("error") } );
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  badRequestMessage: 'Indicate username and password',
  passReqToCallback: true
}));



router.get("/private-page", auth.checkLoggedIn('You must be login', '/login'), (req, res) => {
  res.render("passport/private", { title: 'Private', user: req.user });
});






module.exports = router;
