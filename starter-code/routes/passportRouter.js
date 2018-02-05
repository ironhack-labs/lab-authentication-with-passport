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
  res.render("passport/private", { user: req.user });
});
router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const user = {
    username
  };
  //const password = req.body.password;
  bcrypt.genSalt(bcryptSalt, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hashed) => {
      console.log(req.body.password);
      if (err) {
        throw err;
      } else {
        user.password = hashed;
        const newUser = new User(user);
        newUser.save(err => {
          if (err) {
            return err;
          }
          res.redirect("/");
        });
      }
    });
  });
  //const hashPass =
});

module.exports = router;
