const express        = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
let User = require('../models/User')
let passport = require('passport')

function isAuth(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/')    
  }
}

passportRouter.get('/test', isAuth, (req,res,next)=>{
  res.send('Si está autenticado')
})

passportRouter.get('/login', (req,res,next)=>{
  res.render('passport/login')
})

passportRouter.post('/login', passport.authenticate('local'), (req,res,next)=>{
  console.log(req.user)
  res.redirect('/private-page')
})


// Add passport 
passportRouter.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(()=>res.redirect('/login'))
  .catch(e=>next(e))
})

passportRouter.get('/signup', (req,res,next)=>{
  res.render('passport/signup')
})


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;