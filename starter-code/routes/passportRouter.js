const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("../helper/passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


router.get("/signup", (req, res, next)=>{
  res.render("passport/signup")
})

router.post("/signup",(req, res, next)=>{
  const username =req.body.username;
  const password =req.body.password;

  if(username === "" || password === ""){
    res.render("passport/signup", {message:"invalid user name or password"})
    return;
    }

  User.findOne({username},"username", (err,user)=>{
    if(user !== null){
      res.render("passport/signup", {message:"username already exists" })
      return;
      }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username,
      password: hashPass
      });

    newUser.save((err)=>{
      if(err) res.render("passport/signup", {message:"Something went wrong"});
      else res.redirect("/");
      });
    console.log(newUser)
    })
});

router.get("/login",(req, res, next)=>{
  res.render("passport/login")
})


router.post("/login", passport.authenticate("local",{
  successRedirect: "/",
  failureRedirect:"/login",
  failureFlash: false,
  passReqRoCallback: true
})  )

router.get("/logout",(req, res, next)=>{
  req.logout();
  res.redirect("/login");
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook",{
  successRedirect: "/private-page",
  failureRedirect: "/login"
}));


module.exports = router;
