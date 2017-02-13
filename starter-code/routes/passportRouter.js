const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

router.get('/signup', (req, res, next) => {
  res.render("passport/signup");
});

router.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  else if (password.length < 10) {
    res.render("passport/signup", {
      errorMessage: "Password too short"
    });
    return;
  }
  else{
    User.findOne({ username: username}, (err, user) => {
      if(err){
        next(err);
      } else {
        if(!user) {
          // no user
          var salt     = bcrypt.genSaltSync(bcryptSalt);
          var hashPass = bcrypt.hashSync(password, salt);

          var newUser  = User({
            username,
            password: hashPass
          });
          newUser.save((err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }else {
          res.render("passport/signup", {
            errorMessage: "username already taken"
          });
        }
      }
    });
  }
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", {"message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failiureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
