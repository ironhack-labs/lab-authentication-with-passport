const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
// const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get('/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next)=>{
    res.render('passport/signup.ejs');
});

router.post('/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next)=>{
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

  if (signupUsername === '' || signupPassword === ''){
    res.render('passport/signup.ejs',{
      errorMessage:'Please provide both username and password.'
    });
    return;
  }

  User.findOne(
    {username: signupUsername },
    {username:1},
    (err, foundUser) => {
      if (err){
        next(err);
        return;
      }

      //don't let user register if the username is taken
      if (foundUser){
        res.render('passport/signup.ejs',{
          errorMessage:'Username is taken!'
        });
        return;
      }
        //encrypt the password
      const salt = bcrypt.genSaltSync(10); //signupPassword is the one user provided
      const hashPass = bcrypt.hashSync(signupPassword, salt);


        //create theUser
      const theUser = new User({
        name: req.body.signupName,
        username:req.body.signupUsername,
        encryptedPassword: hashPass
      });

        //save theUser
      theUser.save((err)=>{
        if (err){
          next(err);
          return;
        }
        //redirect to homepage if save is successful
        res.redirect('/');
      });
    }
  );
});

router.get('/login',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next) =>{
    res.render('passport/login.ejs');
});

router.post('/login',
    ensureLogin.ensureNotLoggedIn('/'),
      passport.authenticate('local',
  {
    successRedirect:'/',
    failureRedirect: '/login'
  })
);

router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
});


module.exports = router;
