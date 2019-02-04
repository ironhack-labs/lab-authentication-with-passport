require('dotenv').config();
const mongoose = require("mongoose");
const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user.js");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
// Add passport 
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

mongoose
  .connect(`mongodb://localhost/${process.env.DB}`, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup",(req,res)=>{
  res.render("passport/signup");
})

passportRouter.get("/login",(req,res)=>{
  res.render("passport/login", { "message": req.flash("error") });
})

passportRouter.post("/signup",(req,res)=>{
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);
  User.create({username: req.body.username, password: hash})
  .then(()=> console.log("creado"))
  .catch((err)=> console.log(err));
})

passportRouter.post("/login",passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}),(req,res) =>{})  

module.exports = passportRouter;