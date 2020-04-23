//require
const express = require('express');
const router = express.Router();

const passport = require('passport')
// Link to model User
const User = require('../models/User.model');

// Bcrypt in order to encrypt passwords in the mongodb
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const loggedInUser = require('../helpers/middlewares').loggedInUser
const userIsAdmin = require('../helpers/middlewares').userIsAdmin

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  let user = new User({ username: req.body.username, password: hashPass })
  // console.log(user)
  //save the user and automatically log him in
  user.save().then((theUser) => {
    req.login(theUser, () => { res.redirect('/') }) 
  })})

router.get('/login', (req, res) => {

  req.flash('message') //has to be an array

  // redirect to homepage if already logged in
  if (req.user) {
    res.redirect('/')
  }

  res.render('auth/login', { errorArr: req.flash('message') })
})



router.get('/private-page', loggedInUser,  (req, res, next) => {
  res.render('auth/private', { user: req.user });
});

// use LocalStrategy for authentication
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/login',
  failureFlash: true,
  // passReqToCallback: true
}))

router.get('/logout', (req, res) => {
  req.logout() // this one deletes the user from the session
  res.render('auth/logout');
})


module.exports = router;