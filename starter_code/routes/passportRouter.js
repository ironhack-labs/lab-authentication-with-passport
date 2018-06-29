const express        = require("express");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User           = require("../models/user");
const router         = express.Router();

const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get("/signup", (req, res, next)=> {
  res.render("passport/signup.hbs");
});

// iteration 1 ************* SIGNUP
router.post("/process-signup", (req, res, next) => {
    const { username, originalPassword } = req.body;
    if (originalPassword === "" || originalPassword.match(/[0-9]/) === null) {
      //req.flash("error", "Password mandatory, 1 number madatory");
      res.redirect("/signup");
      return; 
    }

    const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
    
    User.create({ username, encryptedPassword })
    .then((Userdoc) => {
      //req.flash("success", "You successfully signed up");
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
  });

// iteration 2 ******************** LOG IN
 router.get("/login", (req, res, next) => {
    res.render("passport/login.hbs")
  });

router.post("/process-login", (req, res, next) => {
  const { username, loginPassword } = req.body;

  User.findOne( {username} )
    .then((userDoc) => {
      if(!userDoc) {
        //req.flash("error", "Unknown username");
        res.redirect("/login");
        return; 
      }

      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(loginPassword, encryptedPassword)) {
        //req.flash("error", "Invalid password");
        res.redirect("/login");
        return; 
      }
    
      req.login(userDoc, () => {
        res.redirect("/");
      });
 
    })
    .catch((err) => {
      next(err);
    });
});

// 3. bonus: logout
router.get("/logout", (req, res, next) => {
  req.logout();
  //req.flash("success", "You logged out succesfull");
  res.redirect("/");
});

// 4. bonus: accès private page (en cours de construction)
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (!req.user) {
    //redirect away if you are not logged in
    //req.flash("error", "Please log in");
    res.redirect("/login");
    return;
  }
  res.render("passport/private", { user: req.user });
});

module.exports = router;
