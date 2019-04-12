const express        = require("express");
const passportRouter = express.Router();

// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 
const passport = require("passport");


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  function renderWithErrors(errors) {
    res.render('passport/signup', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors({ email: 'Email already registered'})
      } else {
        user = new User(req.body);
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post('/login', (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validation) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.render('passport/signup', {
        user: req.body,
        errors: validation
      })
    } else {
      return req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/private-page')
        }
      })
    }
  })(req, res, next);
});

passportRouter.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('passport/login');
});


module.exports = passportRouter;