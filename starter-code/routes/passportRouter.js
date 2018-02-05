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
  res.render("passport/private", {
    user: req.user
  });
});

router.get("/signup", (req, res) => {
  res.render("passport/signup", {
    user: req.user
  });
});

router.post('/signup', (req, res, next) => {
  const userInfo = {
    name: req.body.username,
    password: req.body.password,
  };
   if(!userInfo.name || !userInfo.password) {
     return res.render ('passport/signup', { errors : "Pleaser enter username and password"});
   }


  bcrypt.genSalt(bcryptSalt, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(userInfo.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      const newUser = new User(userInfo);

      newUser.password = hash;

      newUser.save((err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/login');
      });
    });
  });
});

router.get("/login", (req, res) => {
  res.render("passport/login", {
    "message": req.flash('error')
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));




module.exports = router;