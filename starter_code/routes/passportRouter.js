const express        = require('express');
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");


router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  User.findOne({'username': username})
    .then(user => {
      if (user == null){
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
          username,
          password: hash
        });
        newUser.save()
          .then(user => {
            // res.send(user)
            // res.render('index', {user});
            res.redirect('/');
          })
          .catch(err => {
            res.render('passport/signup', {errorMessage: 'Something went wrong, try again'});
          });
      } else{
        // res.send(user[0]);
        res.render('passport/signup', {errorMessage: 'Username already exists'});
      }

    })
    .catch(err => {
      console.log('You be getting some errors SON: ', err);
    });
  
});

router.get('/login', (req, res, next) => {
  res.render('passport/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;