const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcryptjs');
// Add passport 
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");










passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  User.create({
    username,
    password: hash
  })
    .then(obj => {
      console.log('User created successfully: ', obj); 
      res.render('../views/passport/signup.hbs', {success: true});
    })
    .catch(err => {
      console.log('An error occurred: ', err)
      res.render('../views/passport/signup.hbs', {failure: true});
    });
  
});

passportRouter.get('/login', (req,res,next) =>{
  res.render('passport/login');
});

passportRouter.post('/login', (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/private-page',
    successFlash: true,
    failureRedirect: '/login',
    failureFlash: true
  })(req,res,next);
  

  // User.findOne({username})
  //   .then( user => {
  //     if(user != null){
  //       if(bcrypt.compareSync(password, user.password)){

  //       } else {
  //         res.render('passport/login', {failure: true});
  //       }
  //     } else{
  //       res.render('passport/login', {failure: true});
  //     }
  //   })
  //   .catch(err => {
  //       console.log(err);
  //   });
});

// passportRouter.get("/private-page", (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;