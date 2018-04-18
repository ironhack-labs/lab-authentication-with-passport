const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
// const bcryptSalt = 10;
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', {user: req.user});
});

//  ROUTE TO CREATE AND REDIRECT TO THE SIGNUP PAGE
router.get('/signup', (req, res, next) => {
  res.render('../views/passport/signup.hbs');
});

//  ROUTE TO SAVE USERS CREDENTIALS AND REDIRECT TO HOME PAGE IF CONNECTED

router.post('/process-signup', (req, res, next) => {
  const {username, password} = req.body;

  if (password === '') {
    res.redirect('/signup');
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  User.create({username, encryptedPassword})
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
});

// ROUTE TO CREATE AND REDIRECT TO THE LOGIN PAGE

router.get('/login', (req, res, next) => {
  res.render('../views/passport/login.hbs');
});

//  ROUTE TO LOG IN

router.post('/process-login', (req, res, next) => {
  const {username, password} = req.body;

  User.findOne({username})
    .then(userDetails => {
      if (!userDetails) {
        res.redirect('/login');
        return;
      }
      const {encryptedPassword} = userDetails;
      console.log(password);
      console.log(userDetails);
      console.log(encryptedPassword);
      console.log(bcrypt.compareSync(password, encryptedPassword));
      if (!bcrypt.compareSync(password, encryptedPassword)) {
        console.log(
          'yolo : ',
          !bcrypt.compareSync(password, encryptedPassword)
        );
        res.redirect('/login');
        return;
      }
      req.login(userDetails, () => {
        res.redirect('/');
      });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
