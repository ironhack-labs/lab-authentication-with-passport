const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

/* SIGN UP */
router.get("/signup", (req, res) => {
  res.render("passport/signup");
})

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === "") {
    res.render("signup", {message: "Indicate username and password"});
    reject();
  }

  User.findOne({username})
    .then( user => {
      if(user !== null) throw Error("The username already exists");
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      })
      return newUser.save();
    })
    .then( newUser => {
      res.redirect("/");
    })
    .catch( err => {
      res.render("signup", {message: error.message})
    })
});

/* LOG IN */
router.get("/login", (req, res) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/passport/private-page",
    failureRedirect: "/passport/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

module.exports = router;