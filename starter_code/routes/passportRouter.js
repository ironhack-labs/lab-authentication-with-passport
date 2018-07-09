const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = process.env.BRCRYPT_SALT;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  console.log({ username, password })
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({ username, password: hashPass });

  newUser.save((err) => {
    if (err) {
      res.render('router/signup', { message: 'Something went wrong' });
    } else {
      res.redirect('/');
    }
  })
    .catch(error => {
      next(error)
    })
});

router.get('/login', (req, res, next) => {
  res.render('passport/login',{'message':req.flash('error')});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/passport/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn('/passport/login'), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;