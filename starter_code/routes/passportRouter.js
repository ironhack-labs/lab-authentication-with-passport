const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");




router.get("/signup", (req, res, next)=>{
  res.render("passport/signup.hbs")
})

router.post("/process-signup", (req, res, next)=>{
  const { username, loginPassword } = req.body;

  //mdp peut pas être vide ou ne pas comporter de nombres
  if (loginPassword === "" || loginPassword.match(/[0-9]/)=== null) {
    req.flash("error", "Password cannot be blank and require a number");
    res.redirect("/signup");
    return; //instead of else for cleaner code
  }

  //si on arrive jusqu'ici, on peut enregistrer le user
  const password = bcrypt.hashSync(loginPassword, bcryptSalt);
  User.create({username, password})
    .then((userDoc)=>{
      req.flash("success", "Signed up successfully, try logging in");
      res.redirect("/");
    })
    .catch((err)=>{
      next(err);
    });

  //res.send(req.body);
});


router.get("/login", (req, res, next)=>{
  res.render("passport/login.hbs");
})

router.post("/process-login", (req, res, next)=>{
  //res.send(req.body)

  const { username, loginPassword} = req.body;

  User.findOne({username})
    .then((userDoc)=>{
      if (!userDoc) {
       req.flash("error", "Incorrect username");
        res.redirect("/login");
        return;
      }

      //if we get there, the email is ok, we can check for the pw
      const {password} = userDoc;
      if (!bcrypt.compareSync(loginPassword, password)){
        req.flash("error", "incorrect password");
        res.redirect("/login");
        return;
      }

     
      req.login(userDoc, () => {
        req.flash("success", "Logged in successfully");
        res.redirect("/");
      });
    
    })
    .catch(err =>{
      next(err)
    })
});

router.get("/logout", (req, res, next)=>{
  req.logout();
  req.flash("success", "Logged out successfully");
  res.redirect("/");
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router; 