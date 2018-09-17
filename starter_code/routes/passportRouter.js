const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const saltRounds = 10;


router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


router.get('/signup', (req, res, next ) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ 'username': username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
    
      const newUser = new User({
        username: username,
        password: hashPass
      });

      newUser.save()
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch(err => next(err))
});

router.get('/login', (req, res, next) => {
  res.render('passport/login');
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash:false,
  passReqToCallback: true
}));

module.exports = router;
