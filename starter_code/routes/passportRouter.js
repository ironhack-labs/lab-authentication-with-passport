const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport      = require("passport");
const ensureLogin = require("connect-ensure-login");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/passport/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });
      console.log ("new user created");
      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: err.message
      });
    })
})


router.get('/login', (req, res, next) => {  
  res.render('passport/login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
})
)

module.exports = router;