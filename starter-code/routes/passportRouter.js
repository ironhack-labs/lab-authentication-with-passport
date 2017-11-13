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
router.get('/login', (req, res, next) =>{
  res.render('passport/login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/signup', (req, res, next) =>{
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Please, fill all fields"
    });
    return;
  }
  // if all is filled, search in bbdd
  User.findOne({
      "username": username
    },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
      // if not exist, create and encrypt password
      var hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt));
      var newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/signup");
      });
    });
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
