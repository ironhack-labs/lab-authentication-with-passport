const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get('/private-page', ensureLogin.ensureLoggedIn('/'), (req, res, next) => {
  res.render('passport/private.ejs', { user: req.user });
});

router.get('/signup', ensureLogin.ensureNotLoggedIn('/'), (req, res, next) => {
  res.render('passport/signup.ejs');
});

router.post('/signup', ensureLogin.ensureNotLoggedIn('/'), (req, res, next) => {

  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

  if (signupUsername === '' || signupPassword === '') {
    res.render('passport/signup.ejs', {
      errorMessage: 'Please provide both username and password'
    });
    return;
  }

  User.findOne(
    //1st arg -> criteria of the findOne
    { username: signupUsername},
    //2nd arg -> projection (which fields)
    { username: 1},
    //3rd arg -> callback
    (err, foundUser) => {
      //Don't let he user register if the username is taken
      console.log(foundUser);
      if (foundUser) {
        res.render('passport/signup.ejs', {
          errorMessage: 'Username is taken, sir or madam.'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(signupPassword, salt);

      const theUser = new User({
        username: req.body.signupUsername,
        encryptedPassword: hashPass
      });

      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }

        res.redirect('/');
      });

    }
  );

});





module.exports = router;
