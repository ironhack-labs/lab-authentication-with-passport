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
  res.render("/passport/private", { user: req.user });
});

router.get("/signup", (req, res, next)=>{
  console.log("hello j'y suis")
  res.render("passport/signup.hbs");
})

router.post("/process-signup", (req, res, next)=>{
  const{username, originalPassword} =req.body;

  if (originalPassword === "" || originalPassword.match(/[0-9]/)===null){
      //flash.req("error", "password can't be blank etc..");
      res.redirect("/signup");
      return;
  }

  const encryptedPassword =bcrypt.hashSync(originalPassword,10);
  User.create({username, encryptedPassword})
  .then((userDoc)=>{
      //req.flash("success", "signed up successfully! Try to log in baby!");
      res.redirect("/");
  })
  .catch((err)=>{
      next(err);
  })
})



router.get("/login", (req, res, next)=>{
  res.render("passport/login.hbs");
})



router.post("/process-login", (req, res, next)=>{
  const {username, loginPassword}= req.body;

  User.findOne({username})
  .then((userDoc)=>{
      //"userDoc" will be falsy if we didn't find a user (wrong email).
      if(!userDoc){
          res.redirect("/signup");
          return; // return instead of else when there is a lot of code.
      }

      //we are ready to check the password if we get here(email was okay)
      const{encryptedPassword}= userDoc;
      if (!bcrypt.compareSync(loginPassword, encryptedPassword)){
         // req.flash("error ", "incorect password")
          res.redirect("/login");
          return;
      }

      //we are ready to LOG THEM IN if we get here (password okay too)
      // res.logIn is a passport method for logging in a user
      //behind the scenes it calls our passport.serialized() function
      req.logIn(userDoc, ()=>{
          //req.flash("welcome", "you're logged in");
          res.redirect("/");

      })
      // req.session.userId = userDoc._id; 
  })
  .catch((err)=>{
      next(err);
  })
})

module.exports = router;