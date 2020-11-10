const {genSaltSync}=require('bcrypt')
const express = require('express');
const router = express.Router();
// Require user model
const User=require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt=require('bcrypt')
// Add passport
const session=require('express-session')
const MongoStore=require('connect-mongo')(session)
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup',(req,res)=>{
  res.render('auth/signup')
})

router.post('/signup', async (req,res)=>{
  //1. recibir infor del form
  const {username, password}=req.body
  //2. verificar que no este vacio
  if (!username || !password) {
    return res.render('auth/signup', {error:"Missing fields"})
  }else{
  //3. verificar que no este en bd
  const user=await User.findOne({username})
  if(user){
    return res.render('auth/signup', {error:"Please try with a different username"})
  } 
    //4. Guardar en bd con contraseña hasheada
    const salt=bcrypt.genSaltSync(12)
    const hashpwd=bcrypt.hashSync(password,salt)
    await User.create({username,password:hashpwd})
    //5. Dar respuesta al usuario
    res.redirect('private')
  }
})

router.get('/login',(req,res)=>{
  res.render('auth/login')
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/private',
  failureRedirect:'/login'
}))

router.get('/private',(req,res)=>{
  
})

module.exports = router;

