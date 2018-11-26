const express        = require("express");
const passportRouter = express.Router();
const User = require('../models/User')
const passport = require('passport')

function isLoggedIn (req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  return res.redirect('/passport/login')
}

passportRouter.get('/private', isLoggedIn , (req,res) => {
  const {username} = req.user
  res.render('passport/private',{user:{
    username
  }})
})

passportRouter.get('/login', (req,res) => {
  res.render('passport/login')
})

passportRouter.post('/login', passport.authenticate('local'), (req,res,next) => {
  const email = req.user.email
  User.findOne({email})
  .then( user => {
    res.redirect('/passport/private')
  })
  .catch( err => next(err))
})

passportRouter.get('/signup', (req,res,next) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', (req,res,next) => {
  User.register(req.body, req.body.password)
  .then( user => {
    res.redirect('/passport/private')
  })
  .catch( err => next(err))
})

passportRouter.get('/logout', (req,res)=>{
  req.logout()
  res.redirect('/passport/login')
})

module.exports = passportRouter;