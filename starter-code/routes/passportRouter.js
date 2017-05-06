const express        = require("express");
const passportRoute  = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");



passportRoute.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRoute.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRoute.post('/signup', (req, res, next) => {

  // username and password inputs from signup form
  const un   = req.body.usernameInput;
  const pass = req.body.passwordInput;

  // look for username
  User.findOne(
    {username: un},
    {username: 1},
    (err, theUser) => {
      if (err) {
        next(err);
        return;
      }

      // if a username is found let user know that they have an account
      if (theUser) {
        res.render('passport/signup', {errorMessage: "Username already taken!"});
        return;
      }

      // encrypting password
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(pass, salt);

      // create new user
      const newUser = new User({
        username: un,
        password: hashPass
      });

      // save the user to the database
      newUser.save( (err) => {
        if (err) {
          next(err);
          return;
        }
      });
    }
  );
});


module.exports = passportRoute;
