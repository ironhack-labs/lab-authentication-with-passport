const {Router} = require('express');
const passportRouter = Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/User')
// Require user model

// Add bcrypt to encrypt passwords

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup')
})

// Add passport 
passportRouter.post('/signup', async (req, res) => {
  const{username, password} = req.body

  if(username == '' || password == ''){
      return res.render('passport/signup', {
          message: 'Indicate username and password'
      })
  }

  const  user = await User.findOne( {username} )
  if(user !== null){
      return res.render('passport/signup',{
          message: "The username already exists"
      })
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt)

  const newUser = new User({
      username, 
      password: hashPass,
  })

  console.log({username, password: hashPass})

  try{
      await newUser.save()
      res.redirect('/')
  } catch(error){
      res.render('passport/signup',{
          message: "Something went wrong"
      })
  }
})



const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRouter.get("/login", (req, res, next) => {
    res.render("passport/login");
  });


//utilizamos passport como middleware y su estrategia local
passportRouter.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

passportRouter.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = passportRouter;