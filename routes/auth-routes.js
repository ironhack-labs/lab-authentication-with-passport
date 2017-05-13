const express = require('express');
const bcrypt = require("bcrypt");
const passport = require('passport');
const ensure = require('connect-ensure-login');
const multer = require('multer');
const upload = multer({ dest: './public/img/' });

const User = require('../models/user-model.js');

const authRoutes  = express.Router();

authRoutes.get('/signup',
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
  res.render('auth/signup-view.ejs');
});

authRoutes.post('/signup', upload.single('photo'), (req, res, next) => {
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;
  const photo = req.file;

  if (signupUsername === "" || signupPassword === ""){
    res.render('auth/signup-view.ejs', {
      errorMessage: 'Please provide both username and password'
    });
    return;
  }

  if (!photo){
    res.render('auth/signup-view.ejs', {
      errorMessage: 'Please upload a profile pic'
    });
    return;
  }

  User.findOne(
    { username: signupUsername },
    { username: 1 },
    (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (foundUser) {
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Username is taken'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(signupPassword, salt);

      const theUser = new User({
        name: req.body.signupName,
        username: req.body.signupUsername,
        encryptedPassword: hashPass,
        pic_path: `/img/${req.file.filename}`,
        pic_name: req.file.originalname
      });

      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }
        req.flash(
          'succesfulSignup',
          'You have registered succesfully!'
        );
        res.redirect('/');
      });
    }
  );

});

authRoutes.get('/login',
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
  res.render('auth/login-view.ejs', {
    errorMessage: req.flash('error')
  });
});

authRoutes.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: true,
  failureRedirect: '/login',
  failureFlash: true
  })
);

authRoutes.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

authRoutes.get('/auth/facebook', passport.authenticate('facebook'));
authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/"
}));

module.exports = authRoutes;
