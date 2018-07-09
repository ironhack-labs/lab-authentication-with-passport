const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup")
});

router.post("/signup", (req, res, next) => {
  const {username, password} = req.body;

  User.findOne({username})
    .then(user => {
      if (user !== null) {
        throw new Error("Username exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({username,password: hashPass});

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("passport/signup", {
        errorMessage: err.message
      });
    })
})

router.get('/login', (req, res, next) => {  
  res.render('passport/login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "passport/login",
    failureFlash: true,
    passReqToCallback: true
  })
)


module.exports = router;

