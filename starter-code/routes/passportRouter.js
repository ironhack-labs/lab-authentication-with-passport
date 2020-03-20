const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// Add passport 
const passport = require('passport')
const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// GET route signup page
passportRouter.get('/signup',(req,res,next) => {
res.render('passport/signup')
});

// POST route signup page
passportRouter.post('/signup',(req,res,next) => {
  const username = req.body.username
  const password = req.body.password
if (!username || !password) {
  console.log('Please fill in a password or username')
  res.redirect('/signup')
return 
}
User.findOne({username: username})
.then(name => {
console.log('Found a username: ',username);
if (name !== null) {
  console.log('username already exists')
  res.redirect('/signup')
return
}
console.log('username is',username)
const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

User.create({username: username,password: hashPass})
.then(user => {
    console.log('New user was created: ',user)
    res.redirect('/')
})
.catch(err => console.log('error'));
})
})

// GET route login page
passportRouter.get('/login',(req,res,next) => {
  res.render('passport/login')
  });
  
// POST route login page
passportRouter.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);


module.exports = passportRouter;