const express = require('express');
const passportRouter = express.Router();

// Require user model
const User = require('../models/User')
// Add bcrypt to encrypt passwords

// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/passport/login");
});

passportRouter.get('/login', (req,res,next)=>{
    //res.send("HOLA")
    res.render('passport/login')
})

passportRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  //res.send(req.body)
  const email = req.user.email;
  req.app.locals.user = req.user;
  res.send("Tu eres un usuario real con email: " + email);
})


passportRouter.get('/signup', (req,res)=>{
  //res.send("HOLA")
  res.render('passport/signup')
})

passportRouter.post('/signup', (req,res,next)=>{
    //res.send(req.body)
    User.register(req.body,req.body.password)
    .then(user =>{
      res.json(user)
    })
    .catch(err=>{
      next(err)
    })
})

function checkIfIsHere(req, res, next) {
  console.log("polloyon?", req.isAuthenticated());
  //res.send(req.user.email)
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/passport/login");
}

passportRouter.get("/private-page", checkIfIsHere, (req, res,next) => {
  //res.send(req)
  res.render("passport/private", { user: req.user.email });
});

module.exports = passportRouter;