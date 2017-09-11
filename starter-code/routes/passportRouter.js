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

router.get("/signup", (req, res, next) => {
  res.render("views/passport/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
      res.render("auth/signup", {
        message: "Indicate username and password"
      });
      return;
    }
    User.findeOne({
      username
    }, "username", (err, user) => {

      if (user !== null) {

        res.render("auth/signup", {
          message: "el usuario existe"
        });
        return;

      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
          username,
          password: hashPass
        })
        .save()
        .then(user => res.redirect('/'))
        .catch(e => res.render("auth/signup", {
          message: "Something went wrong"
        }));

    });
    router.get('/login',(req,res) =>{
    res.render('auth/login',{ message: req.flash("error") });
  });

  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));



  }




);


module.exports = router;
