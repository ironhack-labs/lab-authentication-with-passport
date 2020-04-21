const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
// Add passport
const passport = require('passport')
const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('private', { user: req.user });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post(
  '/login',
 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
 
)





router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

//receive data from signup form
router.post('/signup', (req, res) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  let user = new User({ username: req.body.username, password: hashPass })
  user.save().then(() => {

    res.redirect('/login')

})


//receive data from login form
router.post('/login', (req, res) => {

  res.send(req.body.username).then(() => {

    // res.redirect('/login')

})


})})



router.get('/logout', (req, res) => {
  req.logout() // this one deletes the user from the session
  res.render('auth/logout');
})







module.exports = router;
