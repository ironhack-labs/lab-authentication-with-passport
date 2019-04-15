const express        = require("express");
const passportRouter = express.Router();
const passport       = require("passport")
const session        = require ("express-session")
const LocalStrategy  = require("passport-local").Strategy;
// Require user model
const User           = require('../models/user')

// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt")
const numberSalt     = 10;

// Add passport 
passportRouter.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

passportRouter.use(passport.initialize());
passportRouter.use(passport.session());

passportRouter.get("/signup",(req,res,next) => {
  res.render("passport/signup");
})

passportRouter.post("/signup",(req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username ===""|| password===""){
    console.log("Username or password empty")
  }
  User.findOne({
    username
  })
  .then (user => {
    if (user !== null){
      console.log("username exist")
      return
    }
    const salt = bcrypt.genSaltSync(numberSalt);
    const hashPass = bcrypt.hashSync(password,salt);
    
    const newUser = new User({ 
      username: username,
      password: hashPass
    });
    newUser.save((err) => {
      if (err){
        console.log("Unspected error")
      }
      else {
        console.log("Save username")
      }
    })
  })
  .catch(err => {
    next(err)
  })

})
passportRouter.get("/",(req,res,next) => {
  res.render("../index");
})



passportRouter.get("/login",(req,res,next) => {
  res.render("passport/login");
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;