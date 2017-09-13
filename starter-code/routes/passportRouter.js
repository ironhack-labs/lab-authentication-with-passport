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

router.get('/signup', (req, res, next) => {
    res.render('passport/signup.ejs');
});

router.post('/process-signup', (req, res, next) => {
  // console.log(req.body.signupUsername);
  // console.log(req.body.signupPassword);
    // if either email or password are blank
    if (req.body.signupUsername === "" || req.body.signupPassword === "") {
        res.locals.feedbackMessage = 'We need both email and password.';
        res.render('passport/signup.ejs');
        return;
    }

    // check the database to see if there's a user with that email
    User.findOne(
      { email: req.body.signupUsername },

      (err, userFromDb) => {
          if (err) {
              next(err);
              return;
          }

          // "userFromDb" will be "null" if we didn't find anything

          // is this email taken?
          // it is if we found a user
          if (userFromDb) {
              res.locals.feedbackMessage = 'Username taken.';
              res.render('passport/signup.ejs');
              return;
          }
          // if we get to this line, we have the green light to save!

          // encrypt the password
          const salt = bcrypt.genSaltSync(10);
          const scrambledPass = bcrypt.hashSync(req.body.signupPassword, salt);

          // save the user
          console.log(req.body.signupUsername);
          console.log(scrambledPass);
          const theUser = new User({
              username: req.body.signupUsername,
              password: scrambledPass
          });

          console.log(theUser);

          theUser.save((err) => {
              if (err) {
                  next(err);

                  return;
              }

              // set a flash message for feedback after the redirect
              // req.flash('signupSuccess', 'Sign up successful! Try logging in.');

              res.redirect('/');
          }); // close theUser.save((err) => { ...
      }
    ); // close User.findOne( ...
});  // close POST /process-signup

router.get('/login', (req, res, next) => {
    // // check for feedback messages from the log in process
    // res.locals.flashError = req.flash('error');
    //
    // // check for feedback messages from the log out process
    // res.locals.logoutFeedback = req.flash('logoutSuccess');

    res.render('passport/login.ejs');
});

router.post('/process-login',
          // name of strategy   settings object
          //               |     |
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
  }
)
);


router.get('/logout', (req, res, next) => {
    // special passport method for clearing the session
    // (emptying the bowl)
    req.logout();

    // set a flash message for feedback after the redirect
    req.flash('logoutSuccess', 'Log out successful.');

    res.redirect('/login');
});

module.exports = router;
