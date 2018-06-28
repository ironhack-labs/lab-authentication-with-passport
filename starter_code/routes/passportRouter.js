const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

router.get("/signup",(req,res,next)=>{
  res.render("passport/signup.hbs")
});

router.post("/process-signup", (req,res,next)=>{
  const {userName,originalPassword} = req.body;

  if(originalPassword === "" || originalPassword.match(/[0-9]/) === null){
      // req.flash("error", "Password can't be blanck and requires a number (0-9).")
      res.redirect("/signup");
      return;
  }
  const encryptedPassword = bcrypt.hashSync(originalPassword, bcryptSalt);

  User.create({userName, encryptedPassword})
  .then((userDoc)=>{
      // req.flash("success", "Signed up successfully! Try logging in.")
      res.redirect("/");
  })
  .catch((err)=>{
      next(err);
  })
});

router.get("/login",(req,res,next)=>{
  res.render("passport/login.hbs");
});

router.post("/process-login",(req,res,next)=>{
  // res.send(req.body);
  const {userName,loginPassword} = req.body

  User.findOne({userName})
  .then((userDoc)=>{
      if (!userDoc){
          // req.flash("error", "Your email has not been found in the database")
          console.log("Your username has not been found in the database");

          res.redirect("/login");
          return;
      }
      const {encryptedPassword} = userDoc;
      if (!bcrypt.compareSync(loginPassword,encryptedPassword)){
          // req.flash("error", "The Password is INCORRECT")
          console.log("Password incorrect");
          res.redirect("/login");
          return;
      }
      // we are ready to LOG THEM IN if we get here (password was okay too)
      // "req.login()" is a Passport method for loggin in a user
      // (behind the scenes, it calls our "passport.serialize() function")
      req.login(userDoc,()=>{
          // req.flash("success", "You are logged in !")
          console.log("You are logged in");
          res.redirect("/");
      })
  })
  .catch((err)=>{
      next(err);
  });
});


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;