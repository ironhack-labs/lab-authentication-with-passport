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
  res.render("password/private", { user: req.user });
});

router.get('/signup', (req, res, next) => {

  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
  res.render("auth/signup", {
    errorMessage: "Indicate a username and a password to sign up"
  });
  return;
}

User.findOne( {username: username}, (err, user) =>{
  if (user !== null) {
    res.render("auth/signup", {
      errorMessage: "The username already exists"
    });
    return;
  }

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // console.log('username: ', username)
  // console.log('password: ', hashPass)

  var newUser  = new User({
    username: username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render('auth/signup', {errorMessage: 'Something went wrong'});
    } else {
      res.redirect('/')
    }
  });
});
});

router.get('/login', (req, res, next) => {
  res.render('passport/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false, // --> something to check in the future
  passReqToCallback: true
}));

console.log('hola');

router.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log("hkjhkj");
  console.log(req.user);
  res.render('passport/private', {user: req.user});
});



module.exports = router;
