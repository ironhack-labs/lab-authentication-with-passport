const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user.js");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensure         = require("connect-ensure-login");
const passport       = require("passport");

//signup GET
router.get("/signup",
  //redirects to home page if you ARE logged in
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
    if(req.user){
    res.redirect('/');
    return;
  }
    res.render("passport/signup.ejs");
  });

// /signup POST
router.post("/signup",
  ensure.ensureNotLoggedIn('/'),
  (req, res, next) => {
    const signupUsername = req.body.signupUsername;
    const signupPassword = req.body.signupPassword;
    if(signupUsername === '' || signupPassword === '') {
      res.render('passport/signup.ejs', {
        errorMessage: 'Please provide both username and password'
      });
      return;
    }
    User.findOne(
      { username: signupUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err){
          next(err);
          return;
        }
        if (foundUser) {
          res.render('passport/signup.ejs',{
            errorMessage: "Username is taken, buddy"
          });
          return;
        }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(signupPassword, salt);

    const theUser = new User({
      name: req.body.signupName,
      username: signupUsername,
      encryptedPassword: hashPass
    });
    theUser.save((err) => {
      if (err) {
        next(err);
        return;
    }
    res.redirect('/');
      });
    }
  );
});

// /login GET
router.get('/login',
  ensure.ensureNotLoggedIn('/'),
  (req, res, next)=>{
    res.render('passport/login.ejs');
  });

// /login POST
router.post('/login',
  ensure.ensureNotLoggedIn('/'),

  passport.authenticate('local',{ // use the localStrategy code to configure
    successRedirect: '/', //succesful redirects to homepage
    failureRedirect: '/login' //unsuccesful login -> redircets back to the login page
  } )
);


router.get("/private-page", ensure.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;
