const express        = require("express");
const passportRouter = express.Router();
let User = require('../models/user')
let passport = require('passport')



//middleware
function isAuth(req,res,next){
  // if(req.session.currentUser){
    if(req.isAuthenticated()){
    res.redirect('/')
  }else{
    next()
  }
}
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("../views/passport/private", { user: req.user });
});
//log in

passportRouter.post('/login',passport.authenticate('local') ,(req,res,next)=>{
  
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

module.exports = passportRouter;