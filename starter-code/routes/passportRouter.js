const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const salt = bcrypt.genSaltSync(10);

// signup routes
router.get("/signup", (req,res,next)=>{
  console.log('estoy en signup')
  res.render("passport/signup")
})
.post("/signup", (req,res,next)=>{
  const username = req.body.username,
        password = req.body.password;
  if(username === "" || password === ""){
      res.render("passport/signup", {message: "Indicate username and password"});
      return;
  }
  User.findOne({username}, "username", (err, user)=>{
    if (user !== null){
        res.render("passport/signup", {message:"The username already exists"});
        return;
    }
  
    const hashPass = bcrypt.hashSync(password, salt);
  
    const newUser = new User({
       username,
       password:hashPass
    });
  
    newUser.save(err=>{
        if (err) return res.render("passport/signup", { message: "Something went wrong" });
         res.redirect("/");
    });
  
  });
});



//login routes

router.get("/login", (req, res, next) => {
  console.log('entrando')
  res.render("passport/login",  { "message": req.flash("error") });
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

