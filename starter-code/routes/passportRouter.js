const express        = require("express");
const passportRouter = express.Router();
const mongoose = require('mongoose')
const insertUsers  = require('../models/user.js')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const ensureLogin = require("connect-ensure-login");
const flash = require('connect-flash')
const salt = 10;



mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });






passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup',(req,res,next)=>{

res.render('../views/passport/signup')
})


passportRouter.post('/signup',(req,res,next)=>{

  const username = req.body.username
  const password = req.body.password

  const saltHass = bcrypt.genSaltSync(salt)
  const hasPass = bcrypt.hashSync(password,saltHass)

  const newUser = {
    username: username,
    password: hasPass
  }

  insertUsers.create(newUser)
  .then(()=>{

    console.log("Entro")

  })
})

passportRouter.get('/login',(req,res,next)=>{

  res.render('../views/passport/login')
})



passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));


passportRouter.get('/private', ensureLogin.ensureLoggedIn(), (req,res,next)=>{


  res.render('../views/passport/private', {user: req.user})
})


module.exports = passportRouter;