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
  res.render("passport/private.ejs", { user: req.user });
});

router.get('/signup', ensureLogin.ensureNotLoggedIn(), (req, res, next) =>{
  res.render('passport/signup.ejs');
});

router.post('/signup', (req, res, next) => {
  const signupUsername = req.body.usernameInput;
  const signupPassword = req.body.passwordInput;

  if (signupUsername === '' || signupPassword ==='') {
    res.render('signup',
    { errorMessage: "Please provide both username and password"
  });
  return;
  }
  else if (true) {
    User.findOne(
      { username: signupUsername },
      { username: 1},
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }
        if(foundUser){
          res.render('/signup',
        { errorMessage: 'Username is taken'});
        return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(signupPassword, salt);

        const theUser = new User({
          username: signupUsername,
          password: hashPass
        });
        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }
          res.redirect('/');
        });
      });
    }
});

router.get('/login', (req, res, next) => {
  res.render('passport/login.ejs');
});

router.post('/login', ensureLogin.ensureNotLoggedIn(), passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})
);


module.exports = router;
