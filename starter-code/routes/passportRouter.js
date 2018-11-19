const express = require('express');

const passportRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const passport = require('passport');

const bcryptSalt = 5;

const User = require('../models/user');

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', {
    user: req.user,
  });
});

passportRouter.get('/signup', (req, res, next) => res.render('passport/signup'));

passportRouter.post('/signup', (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  if (username === '' || password === '') {
    res.render('auth/signup', {
      message: 'Indicate username and password',
    });
    reject();
  }

  User.findOne({
    username,
  })
    .then((user) => {
      if (user !== null) throw new Error('The username already exists');

      const newUser = new User({
        username,
        password: hashPass,
      });
      newUser.save();
    })
    .then(() => res.redirect('/'))
    .catch(err => next(err));
});

module.exports = passportRouter;
