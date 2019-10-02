const express = require('express');

const passportRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);
const user = require('../models/user');

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  const hash = bcrypt.hashSync(password, salt);

  const newUser = {
    username,
    password: hash,
  };

  user.create(newUser)
    .then((bb) => {
      console.log(`foi criado o nosso usuario ${bb}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

passportRouter.get('/login', (req, res) => {
  res.render('passport/login');
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});


module.exports = passportRouter;
