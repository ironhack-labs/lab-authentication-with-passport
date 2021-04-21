const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req,res)=>{
  res.render('auth/signup')
});

router.post('/signup', (req,res,next)=>{
  const {username, password} = req.body
  //Comprobar que username y password no esten vacios 
  if(username === '' || password === ''){
    res.render('signup',{ errorMessage: 'Tienes que rellenar todos los campos'})
  }
  User.findOne({username})
  .then((user) => {
    //Verificar que el usuario ya existe
    if(user){
      res.render('signup', {errorMessage: 'Este usuario ya existe'})
    }else{
      const hashedPassword = bcrypt.hashSync(password, 10)
      User.create({username: username, password: hashedPassword})
      .then((result) => {
        res.redirect('/login')
      })
    }
  }).catch((err) => {
    
  });
})

router.get('/login',(req,res)=>{
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local',{
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = router;
