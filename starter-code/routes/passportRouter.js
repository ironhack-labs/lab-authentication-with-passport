const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User           = require('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt         = require('bcrypt');
const bcryptSalt     = 10;
// Add passport 
const passport       = require('passport');
//ensure login
const ensureLogin = require("connect-ensure-login");

//GET sign up page 
passportRouter.get('/signup',(req,res,next)=> {
  res.render('../views/passport/signup.hbs');
})

//POST sign up page
passportRouter.post('/signup',(req,res,next)=> {
  const userName = req.body.username;
  const passWord = req.body.password;
  if(userName==='' || passWord==='') {
    res.render('../views/passport/signup.hbs',{errorMessage:'The username and the password should not be empty'});
    return;
  }
  User.findOne({username:userName})
    .then(user => {
      if(user) {
        res.render('../views/passport/signup.hbs',{errorMessage:'The username exists!'});
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(passWord,salt)
      User.create({username:userName,password:hashPass})
        .then(()=>res.redirect('/'))
        .catch(e=>{throw e})
    })
    .catch(e=>{next(e)});
})

//GET log in page
passportRouter.get('/login',(req,res,next)=> {
  res.render('../views/passport/login.hbs',{message:req.flash('error')})
}) 
passportRouter.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true,
}))
//GET log out page
passportRouter.get('logout',(req,res,next)=> {
  req.logout();
  res.redirect('/login')
})

//Get the private page
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("../views/passport/private", { user: req.user });
});

module.exports = passportRouter;