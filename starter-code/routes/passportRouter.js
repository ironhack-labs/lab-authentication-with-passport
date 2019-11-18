const express        = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup",(req, res) => {
  res.render("passport/signup");
})

passportRouter.post("/signup",(req, res) => {
  const plainPass = req.body.password;
  if (req.body.username.length > 0 && plainPass.length > 0) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hash = bcrypt.hashSync(plainPass, salt);

    User.create({
        username: req.body.username,
        password: hash
      })
      .then(newUser => {
        res.json({
          created: true,
          newUser
        });
      })
      .catch((error) => {
        res.json({
          created: false,
          errorMsg: "That user name is already in use"
        });
      });

  } else {
    res.json({
      created: false,
      errorMsg: "You must fill both user name and password fields!"
    });
  }
})


module.exports = passportRouter;