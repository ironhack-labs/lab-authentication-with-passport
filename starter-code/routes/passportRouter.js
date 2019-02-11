const express        = require("express");
const passportRouter = express.Router();

// Require user model
let User = require('../models/User')

// Add passport 
let passport = require('passport')

function isAuth(req,res,next){
  if (req.isAuthenticated()){
    res.redirect('/')
  }else{
    next()
  }
}

///sign in
passportRouter.post('/signup', (req,res,next)=>{
  res.redirect('/')
})
passportRouter.get('/login', isAuth,(req,res)=>{
  res.render('../views/passport/login')
})

//sing up
passportRouter.post('/signup',(req,res,next)=>{
  User.register(req.body,req.body.password)
  .then(()=>res.redirect('/login'))
  .catch(e=>next(e))
})

passportRouter.get('/signup',(req,res)=>{
  res.render('../views/passport/signup')
})

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("../views/passport/private.hbs", { user: req.user });
});

module.exports = passportRouter;