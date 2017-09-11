const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup", { title: "Sign up" })
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (username === "" || password === "") {
    res.render("auth/signup", {
      title: "Sign up",
      errorMessage: "Indicate a username and a password to sign up"
    })
    return
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("auth/signup", {
        title: "Sign up",
        errorMessage: "User already exists"
      })
      return
    }
    const salt     = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    new User({
        username : username,
        password : hashPass
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e))
  })
})

module.exports = router;
