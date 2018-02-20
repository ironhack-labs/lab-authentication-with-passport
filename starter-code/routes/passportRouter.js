const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");



router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if user wrote anything
  if (username === "" || password === "") {
    res.render('passport/signup', { message: 'Please Input A Username & Password'});
    return;
  }

  // check if username exists
  User.findOne({username}, "username", (err, user) => {
    if (user !== null) {
      res.render('passport/signup', { message: 'Username already Exists'});
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User ({
      username, 
      password: hashPass
    });

    // save new user to database
    newUser.save((err) => {
      if (err) {
        res.render('/passport/signup', { message: 'Something Went Wrong'});
      } else {
        res.redirect('/');
      }
    });
  });
});

//get login form
router.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});


// route to handle login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


//private route
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});




module.exports = router;
