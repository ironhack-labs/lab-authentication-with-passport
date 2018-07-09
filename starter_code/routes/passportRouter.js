const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.get('/login', (req, res, next) => {
  res.render('passport/login');
});

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }
      if(username == "" || password== ""){
        throw new Error("Fields cannot be empty")
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

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

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/passport/login",
  failureFlash: true,
  passReqToCallback: true
})
)

router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})


module.exports = router;