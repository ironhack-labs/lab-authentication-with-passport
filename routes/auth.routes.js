const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const bcryptjsSalt = 10;
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  res.render('signup')
});
const salt = bcrypt.genSaltSync(bcryptSalt);

const hashPass = bcrypt.hashSync(password, salt);

if (username === '' || password === '') {
  console.log(username, password)
  res.render('signup-form', {
    errorMessage: 'please type username and password;'
  });
  return;
}
User.create({
  username,
  password: hashPass
}).then(user => {
  console.log(user);
  res.redirect('/login');
})
.catch(err => res.status(400).render('signup-form', {
  errorMessage: err.errmsg
}));

//.catch(err => next(err));
// LOGIN routes

router.get('/login', (req, res, next) => {
  res.render('login-form');
});

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (username === '' || password === '') {
    res.render('login-form', {
      errorMessage: 'please type username and password'
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {

      // checking if username exists in database

      if (!user) {
        res.render('login-form', {
          errorMessage: 'invalid username or password'
        })
        return;
      }

      // since user exits let's check his/her password
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/books');
      } else {
        res.render('login-form', {
          errorMessage: 'invalid password or username'
        })
      }

    })
    .catch(err => console.log(err));

});


// LOGOUT route

router.get('/logout', (req, res) => {
  req.session.destroy((err) => res.redirect('/login'));
})





module.exports = router;
