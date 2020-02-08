const express        = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const { hashPassword, checkHashed } = require("../lib/hashing");
const passport = require("passport");

// Require user model
passportRouter.get("/signup", (req,res,next) => {
  //console.log("hola");
  res.render("passport/signup");
})

passportRouter.post("/signup", async (req,res,next) => {
  const { username, password } = req.body;
  const existUser = await User.findOne({ username });
  if(!existUser){
    const NewUser = await User.create({ username, password:hashPassword(password) });
    console.log("Usuario Creado");
    res.redirect("/");
  }
  
})
passportRouter.get("/login", (req,res,next) => {
  //console.log("hola");
  res.render("passport/login");
})

// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;