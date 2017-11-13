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

router.get("/signup", (req, res) => {
  res.render("passport/signup")
})

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username == "" || password == "") {
    res.render("passport/signup", {
      errorMessage : "Indicate username and password"
    });
    return;
  }

  User.findOne({"username" : username}, (error, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage : "Username already exist"
      });
      return;
    }
  });

  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User ({
    username,
    password: hashPass,
  });

  newUser.save(error => {
    if (error){
      res.render("passport/signup", {
        errorMessage : "Couldn't sign up"
      });
    }else{
      res.redirect("/");
    }
  });

})



module.exports = router;
