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

router.get("/login", function(req, res, next) {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", function(req, res, next) {
  res.render("passport/signup");
});

router.post("/signup", (req,res,next)=>{
  const username = req.body.username,
        password = req.body.password1;
  if(username === "" || password === ""){
      res.render("/passport/signup", {message: "Indicate username and password"});
      return;
  }

  if(password!=req.body.password2){
    res.render("/passport/signup", {message: "Your passwords don't match"});
      return;
  }

  User.findOne({username}, "username", (err, user)=>{
     if (user !== null){
         res.render("/passport/signup", {message:"The username already exists"});
         return;
     }

     const hashPass = bcrypt.hashSync(password, bcryptSalt);

     const newUser = new User({
        username,
        password:hashPass
     });

     newUser.save(err=>{
         if (err) return res.render("/passport/signup", { message: "Something went wrong" });
          res.redirect("/");
     });

  });
});
module.exports = router;
