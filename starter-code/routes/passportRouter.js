const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const path = require("path");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next)=>{
  res.render("passport/signup");
})

router.post("/signup", (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;

  if (username == "" || password == ""){
    res.render("passport/signup", { message: "Username and password, please"});
    return;
  }

  User.findOne({ username }, "username", (err, user)=>{
    if (user !== null){
      res.render("passport/signup", {message: "This user already exists"});
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
    .catch(e => res.render("signup"),{message: "Something went wrong. Try again"});
  })
})

router.get("/login",(req,res,next)=>{
  res.render("passport/login");
  return;
})

router.post("/login",passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqtoCallback: true
}))




module.exports = router;
