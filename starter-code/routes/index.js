const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const saltRounds   = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get('/', ensureNotAuthenticated, (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', ensureNotAuthenticated, (req, res, next) => {

      const newUser = User({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds))
      });
  
      if (req.body.username === "" || req.body.password === "") {
          res.render("passport/signup", {
            errorMessage: "All fields required to sign-up"
          });
          return;
      }
  
      User.findOne({ "username": newUser.username }, "username", (err, user) => {
          if (user !== null) {
            res.render("passport/signup", {
              errorMessage: "That username already exists"
            });
            return;
          }
      })
  
     newUser.save((err) => {
          if (err) {
              next(err);
              res.render("passport/signup", {
                 errorMessage: "Something went wrong when signing up"
               });
          } else {
            req.login(newUser, (err) => {
              if (err) {
                next(err);
              }
              res.redirect('private-page');
            })  
          }
      });
  });



router.get('/login', ensureNotAuthenticated, (req, res, next) => {
  res.render('passport/login');
});

router.post('/login', passport.authenticate("local", {
    successRedirect: '/private-page',
    failureRedirect: "/login",
}));

function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('private-page')
  }
}


module.exports = router;
