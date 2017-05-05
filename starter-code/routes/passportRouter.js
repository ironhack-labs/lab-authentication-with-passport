const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Username and password needed" });
    return;
    }
    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
    return;
  }

  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render("password/signup", { message: "The username already exists" });
    } else {
      res.redirect("/login");
    }
  });
});
});


router.get("/login", (req, res, next) => {
    res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));






module.exports = router;
