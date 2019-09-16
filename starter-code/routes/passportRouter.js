const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport
const passport = require('passport'); 


const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res, next) => {
  res.render('/passport/signup.hbs');
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('/passport/signup', { message: 'Username already exists'})
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

    .catch(error => next(error))
    }) 
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;