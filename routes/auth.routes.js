const express = require('express');
const router = express.Router();
// Require user model
const User=require('../models/User.model');
// Add bcrypt to encrypt passwords
const bcrypt=require('bcryptjs');
// Add passport
const passport=require('passport');

const ensureLogin = require('connect-ensure-login');



router.get('/signup', (req, res) =>{
  res.render('auth/signup');
});

router.get('/login', (req, res) =>{
  res.render('auth/login' );
});

router.post('/login',
  passport.authenticate('local', {
    // here you can add your own routes 
    successRedirect: '/auth/private-page',
    failureRedirect: '/auth/login',
    // this is set
    failureFlash: true,
    passReqToCallback: true
  })
);


router.post('/signup', (req, res, next) =>{
  const {username, password} = req.body;

  if(password.length<8){
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimum.'
    });
    return;
  }
    if(username===''){
      res.render('auth/signup', {
        message:'Your username cannot be empty.'
      });
      return;
    } 

    User.findOne({username:username})
    .then((found)=> {
      if(found !== null){
        res.render('auth/signup', {
          message:'Username is already taken'
        });
      } else{
        const salt=bcrypt.genSaltSync();
        const hash=bcrypt.hashSync(password, salt);
        User.create({username:username, password:hash})
        .then(dbUser => {
          req.login(dbUser, err => {
            if (err){
              next(err);
            } else{
              res.redirect('/');
            }
          })
        })
        .catch(err => {
          next(err);
        });
      }
    });
   

});

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/logout', (req, res, next) => {
  // passport syntax - this is called 'syntax sugar' around the basci syntax:
  // req.session.destroy
  req.logout();
  res.redirect('/');
});

router.get('/github', passport.authenticate('github'));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

module.exports = router;
