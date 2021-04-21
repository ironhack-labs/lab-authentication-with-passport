const express = require('express');
const router = express.Router();
const User = require(`../models/User.model`)
const bcrypt = require(`bcrypt`)
const passport = require(`passport`)



const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get(`/signup`,(req,res)=>{
res.render(`auth/signup`)
})

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body
  if(username===`` || password===``){
    res.render(`auth/signup`, {errorMessage: `Tienes que rellenar todos los campos`})
  }
  User.findOne({username})
  .then((user)=>{
  if(user){
    res.render(`auth/signup`, {errorMessage:`Este usuario ya existe`})
  } else{
    const hashedPassword = bcrypt.hashSync(password, 10)
    User.create({username, password: hashedPassword})
    .then((result)=>{
      res.redirect(`/login`);
      
    })
  }
  })
  .catch((err)=>{
  console.log(err)
  })
  ;
});

router.get(`/login`, (req,res)=>{
  res.render(`auth/login`)
})

router.post(`/login`, passport.authenticate(`local`, {
  successRedirect:`/private-page`,
  failureRedirect:`/login`,
  failureFlash: true,
  passReqToCallback: true,
}))

router.get(`/logout`, (req, res)=>{
  req.logout()
  res.redirect('/login')
})

module.exports = router;
