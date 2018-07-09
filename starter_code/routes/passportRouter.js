const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/signup", (req, res, next) =>{
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) =>{
  const {username, password} = req.body;
  console.log(username, password);
  User.findOne({username})
    .then( user => {
      if(user!==null) {throw new Error("Username already exists!!!");}
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({username, password: hashPass});
      console.log(newUser);
      return newUser.save();
    }).then(user => {
      res.redirect("/");})
    .catch( err => {
      console.log(err);
      res.render("/");
    })
});

router.get("/login", (req, res, next) =>{
  res.render("passport/login");
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res, next) =>{
  req.logout();
  res.redirect("/");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});
module.exports = router;