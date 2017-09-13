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

router.get("/signup", (req, res, next) => {
  console.log('cows');
  res.render("./passport/signup.ejs");
});

router.post("/signup-process", (req, res, next) => {
  if(req.body.signupUser === "" || req.body.signupPassword === ""){
    res.locals.feedbackMessage = "We need both email and password.";
    res.render('./passport/signup.ejs');
    return;
  }

  // console.log('HEY OVER HERE 1');
  User.findOne(
    { username: req.body.signupUser },
    (err, userFromDb) => {
      // console.log('HEY OVER HERE 2');
      if (err) {
        next(err);
        return;
      }

      if(userFromDb) {
        res.locals.feedbackMessage = "Email taken.";
        res.render('./passport/signup.ejs');
        return;
      }
      // console.log('HEY OVER HERE 3');

      const salt = bcrypt.genSaltSync(10);
      const scrambledPass= bcrypt.hashSync(req.body.signupPassword, salt);
      // console.log('the scrablled pass' + scrambledPass);
      const theUser = new User({
      username: req.body.signupUser,
      password: scrambledPass
    });


    // console.log(theUser);
    // console.log('HEY OVER HERE 4');
    theUser.save((err) => {
      console.log('HEY OVER HERE 444444');
      console.log('inside the save');
      if(err) {
        next(err);
        return;
      }
      console.log(theUser);
      // console.log('HEY OVER HERE 5');
      // req.flash('signupSuccess', 'Sign up succesful! Try logging in.');
      res.redirect('/');
    });

    }
  );
  // return;
});
// Post ends HERE

router.get('/login', (req, res, next) => {
  res.locals.flashError = req.flash('error');


  // check for feedback messages from the log out process
  res.locals.logoutFeedback = req.flash('logoutSuccess');

  res.render('passport/login.ejs');
});

router.post('/login-process',

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res, next) => {

    req.logout();

    // set a flash message for feedback after the redirect
    req.flash('logoutSuccess', 'Log out successful.');

    res.redirect('/login');
});






module.exports = router;
