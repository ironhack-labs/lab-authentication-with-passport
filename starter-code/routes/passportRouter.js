const express        = require("express");
const passportRouter = express.Router();
const passport = require('passport')
const User = require('../models/user')
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


const ensureLogin = require("connect-ensure-login");



passportRouter.get("/private-page",  passport.authenticate('local'), (req, res) => {
  const username = req.User.username
  res.render("passport/private");
});

passportRouter.get('/signup',(req,res,next)=>{
  res.render('passport/signup')
})
passportRouter.post('/signup',(req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user => {
    console.log(user)
  })
})
passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});
module.exports = passportRouter;