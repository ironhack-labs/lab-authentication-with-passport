const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport
const passport = require('passport'); 

const secure = require('../middlewares/secure');
const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('passport/signup', { message: 'Please indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('passport/signup', { message: 'Username already exists'})
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User ({
        username,
        password: hashPass
      });

      newUser.save()
        .then(() => res.redirect('/'))
        .catch(error => next(error))
    }) 
    .catch(error => next(error))
});

passportRouter.post('/login', passport.authenticate('localStrategy', {
  successRedirect: '/private',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));



passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = passportRouter;