const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = bcrypt.genSaltSync(10);
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

//signup
router.get("/signup", (req, res, next) =>{
  res.render("passport/signup")
});

router.post("/signup",(req, res, next) =>{
  const username = req.body.username,
        password = req.body.password;
  if(username === "" || password === ""){
    return res.render("passport/signup", {message: 'Indicate username and password'});
  }

  User.findOne({username}, "username", (err, user) =>{
    if (user !== null){
      return res.render("passport/signup", {message: 'The username already exists'});
    }
    const passwordHash = bcrypt.hashSync(password, bcryptSalt);
    const newUser = new User({
      username,
      password: passwordHash
    });

    newUser.save(err =>{
      if (err) return res.render("passport/signup", {message: "Error"})
      res.redirect("/");
    })
  });

});

//login
router.get("/login", (req, res, next) =>{
  res.render("passport/login", { "message": req.flash('error')});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});






module.exports = router;
