/*jshint esversion: 6 */

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

  res.render('passport/signup');

});

router.post("/signup", (req,res,next)=>{

  const username = req.body.username;
  const password = req.body.password;
  // const temp = strength(password);
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  var newUser = User({
    username,
    password: hashPass
  });

  if (username === "" || password === "") {
    res.render('passport/signup', {
      errorMessage: "Please enter a username and password!"
    });
    return;
  }

  // if (temp.score < 3) {
  //   res.render('auth/signup', {
  //     errorMessage: "Please use a stronger password!!! " + temp.feedback.warning + " " + temp.feedback.suggestions
  //
  //   });
  //   return;
  // }

  User.findOne({"username": username},
    "username",
    (err,user) => {
      if (user !== null) {
      res.render('passport/signup', {
        errorMessage: 'The username already exists'
    });
    return;
  }

  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username, // this is only allowed on ES6
              // regularly it can also be expressed as username: username
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render('passport/signup', {
        errorMessage: "Something went wrong"
      });
    } else {
      res.redirect("/login");
    }
  });
  });
});

router.get('/login', (req, res, next)=>{
  res.render('passport/login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/passport/facebook", passport.authenticate("facebook"));
router.get("/passport/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/login"
}));




module.exports = router;
