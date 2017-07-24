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
  res.render("passport/signup.ejs");
})


router.post("/signup", (req, res, next) => {
  const {email, psw} = req.body;

      if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Don't mess with me ! Indicate a username and a password to sign up !"
        });
        return;
      }

      const newUser = new User({
        username,
        password
      });

      newUser.save()
      .then(() => {
        res.render("/passport/login")
      }).catch((err) => {
        res.render("passport/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      })
})






module.exports = router;
