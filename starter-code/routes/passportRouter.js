const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user.js");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

const passportRouter = express.Router();

passportRouter.get('/passport/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next) => {
    res.render('passport/signup.ejs');
  }
);

passportRouter.post('/passport/signup',
  ensureLogin.ensureNotLoggedIn('/'),
  (req, res, next) => {
    const signupUsername = req.body.signupUsername
    const signupPassword = req.body.signupPassword;

    if (signupUsername === '' || signupPassword === '') {
      res.render('passport/signup.ejs', {
        errorMessage: 'Please provide both username and password.'
      });
      return;
    }

    User.findOne(
      { username: signupUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        if (foundUser) {
          res.render('/passport/signup.ejs', {
            errorMessage: 'Username is taken. Try again.'
          });
          return;
        }

        // NO ERRORS? LETS GO! LOGIC!
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(signupPassword, salt);

        const theUser = new User({
          name: req.body.signupName,
          username: signupUsername,
          encryptedPassword: hashPass
        });

        // SAVE
        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }
          // Redirect to home page if save is successful
          res.redirect('/')
        })
        });
      }
    );



// ALREADY LOGGED IN? - REDIRECTS.
passportRouter.get('/passport/login',

  ensureLogin.ensureNotLoggedIn('/'),
    (req, res, next) => {
    res.render('/passport/login.ejs');
  }
);

passportRouter.post('/passport/login',
  ensureLogin.ensureNotLoggedIn('/'),
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/passport/login'
  });

router.get("/private-page",

ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private",
    { user: req.user
  });
});






module.exports = passportRouter;
