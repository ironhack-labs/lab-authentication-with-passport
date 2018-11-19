const express = require("express");
const passportRouter = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const ensureLogin = require("connect-ensure-login");


passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});


passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post('/signup', (req, res, next) => {

  if (req.body.username === '' || req.body.password === '') {
    res.redirect('/');
  }


  let newUser = new User();

  console.log(newUser);

  User.findOne({ username: req.body.username })
    .then((found) => {
      if (found) {
        console.log('There is already a user with this name in the database.');
        res.redirect('/error');
        
        return
      } else {
        newUser.username = req.body.username;
        newUser.pasword = req.body.password;
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        newUser.password = hashedPassword;
        newUser.save()
          .then(() => {
            res.redirect('/login');
          })
          .catch((err) => {
            next();
            return err
          });
      }
    })
    .catch((err) => {
      next();
      return err
    })

})

passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.user);
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/error', (req, res, next) => {
  res.render('error',{ message: 'There is already a user with this name in the database.' });
})




module.exports = passportRouter;