const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// Add passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const ensureLogin = require('connect-ensure-login');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});


// passport.use(new LocalStrategy({
//   passReqToCallback: true
// }, (req, username, password, next) => {
//   User.findOne({
//       username
//     })
//     .then(user => {
//       if (!user) {
//         return callback(null, false, {
//           message: 'Incorrect username'
//         });
//       }
//       if (!bcrypt.compareSync(password, user.password)) {
//         return callback(null, false, {
//           message: 'Incorrect password'
//         });
//       }
//       callback(null, user);
//     })
//     .catch(error => {
//       callback(error);
//     });
// }));

passport.use(
  new LocalStrategy((username, password, callback) => {
    User.findOne({
        username
      })
      .then(user => {
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username!'
          })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return callback(null, false, {
            message: 'Incorrect password!'
          })
        }
        callback(null, user);
      })
      .catch(e => callback(e));
  })
)

//GET signup page

router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs')
})

router.post('/signup', (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {
      message: 'Indicate username and password if you wanna enter this darkness'
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          message: 'The username already exists - Ha! Ha!'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      res.render('auth/signup', {
        message: 'Something went wrong'
      });
    });
});

//GET login page

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    message: req.flash('error')
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    // passReqToCallback: true
  })
);

// GET logout page

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(() => { res.redirect("/login"); })
  // res.redirect('/login');
});


//GET private page

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', {
    user: req.user
  });
});

module.exports = router;