const express        = require("express");
const router         = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.get('/login', (req, res, next) => {
  res.render('passport/login');
});

router.get("/private-page", showUser, ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.post('/signup', async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
  res.render("passport/signup", {
    errorMessage: "Fill all fields to sign up."
  });
  return;
  }

  User.findOne({ "username": username }, //search condition
  "username", //projection!
  (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
  });

  const salt     = await bcrypt.genSalt(bcryptSalt);
  const hashPass = await bcrypt.hash(password, salt);

  const newUser  = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render("passport/signup", {
        errorMessage: "Something went wrong"
      });
  } else {
    res.redirect("/");
    }
  });

});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));


function showUser(req, res, next) {
  console.log(req.user);
  next();
}

module.exports = router;
