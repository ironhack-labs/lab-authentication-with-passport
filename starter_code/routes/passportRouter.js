const express        = require("express");
//const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const passportRouter=express.Router();

passportRouter.get("/signup",(req, res, next)=>{
  res.render("passport/signup");
});

passportRouter.post("/signup",(req, res, next)=>{
  const username=req.body.username;
  const password=req.body.password;

  if(username===""||password===""){
      res.render("passport/signup", { message: "Indicate username and password"});
      return;
  }
  User.findOne({username},"username",(err, user)=>{
      if(user !== null){
          res.render("passport/signup",{message: "The username already exists"});
          return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser =new User({
          username,
          password: hashPass
      });

      newUser.save((err)=>{
          if(err){
              res.render("passport/signup",{message: "Some error"});
          }else{
              res.redirect("/");
          }
      });
  });
});
passportRouter.get("/login", (req, res, next)=>{
  res.render("passport/login", {"message": req.flash("error")});
});

passportRouter.post("/login", passport.authenticate("local",{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports=passportRouter;