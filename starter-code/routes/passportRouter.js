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

router.get("/signup", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/signup", {
    user: req.user
  });
});

router.post('/signup', (req, res, next) => {
  // const { username, password } = req.body;

  const username = req.body.username
  const password = req.body.password


  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"

    });
    return;
  }

  User.findOne({
      "username": username
    }).exec()
    .then(user => {
      if (user) {
        res.render("passport/signup", {
          errorMessage: "The username already exists"
        });
      }
    })
    .then(() => {
      // Hash the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save()
        .then(() => {
          console.log(`Se ha creado el usuario ${username}`);
          res.redirect("/")
        })
        .catch(e => next(e))
    });
});

router.get('/login', (req, res, next) => {
  res.render('passport/login', {
    title: "Log-in"
  });
});



router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login"
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
 });








module.exports = router;