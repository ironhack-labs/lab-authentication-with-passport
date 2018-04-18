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

//Sign up feature
router.get("/signup", (req, res, next) => {
  res.render("passport/signup")
});

router.post("/process-signup", (req, res, next) => {
  const {username, password} = req.body
  if (password === "" || password.match(/[0-9]/) === null){
    res.redirect("/login");
    return
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  User.create({username, encryptedPassword})
  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    next(err);
  })
})

// Log-in feature

router.get("/login", (req, res, next) => {
  res.render("passport/login")
});

router.get("/private", (req, res, next) => {
  res.render("passport/private")
});

router.post("/process-login", (req, res, next) => {
  const {username, password} = req.body
  User.findOne({username})
    .then((userDetails) => {
      if (!userDetails) {
        res.redirect("/login");
        return
      }
  const {encryptedPassword} = userDetails;
  if (!bcrypt.compareSync(password, encryptedPassword)) {
    res.redirect("/login");
    return;
  }

  req.login(userDetails, () => {
  
  res.redirect("/private");
  });
    })
    .catch((err) => {
      next(err)
    }); 
    });

    router.get("/logout", (req, res, next) => {
      req.logout();
      res.redirect("/");
  });

// })

module.exports = router; 