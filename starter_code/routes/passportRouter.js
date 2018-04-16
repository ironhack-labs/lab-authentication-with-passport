const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const flash = require("connect-flash");

//Mostrar página signup
router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

//Post pagina signup
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate username and password"
    });
  }
  User.findOne({ username })
    .then(user => {
      if (user !== null) throw new Error("The username already exists");
      const hashPass = bcrypt.hashSync(password, bcryptSalt);

      const newUser = new User({
        username,
        password: hashPass
      });
      return newUser.save();
    })
    .then(newUser => {
      res.redirect("/");
    });
});

//Mostrar pagina Log-in
router.get("/login", (req, res) => res.render("passport/login", {error: req.flash}));


//Post pagina Log-in
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: false,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;
