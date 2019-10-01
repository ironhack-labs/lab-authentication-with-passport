const express        = require("express");
const passportRouter = express.Router();
const User = require('../models/User');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport 
const passport = require('../helpers/passport');


const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {

  const { username, password } = req.body;
  let error;

  if ( !username || !password ) {
    error = 'Please make sure to enter username and password';
    return res.render('passport/signup', { error });
  }

  if( req.body.password !== req.body['confirm-password'] ) {
    error = 'Please make sure to confirm the password correctly';
    return res.render('passport/signup', { error });
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({username})
  .then( user => {

    if ( user ) {
      error = 'There is an user registered with that username';
      return res.render('passport/signup', { error });
    }
    User.create({ username, password: hashPass })
    .then( user => {
      console.log('User created');
      res.redirect('/login');
    });

  });

});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info = {}) => {

    console.log(err, user, info);
    const { message: error } = info;

    if ( error ) res.render('passport/login', { error });

    req.login( user, err => {
      res.redirect('/private-page');
    });

  })(req, res);
});


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = passportRouter;