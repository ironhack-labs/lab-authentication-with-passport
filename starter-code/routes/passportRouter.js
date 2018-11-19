const express = require("express");
const passportRouter = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;


const ensureLogin = require("connect-ensure-login");


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



passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {

  if (req.body.username === '' || req.body.password === '') {
    res.redirect('/signup');
  }

  let newUser = new User();

  console.log(newUser);

  User.findOne({username: req.body.username})
  .then((found) => {
    if (found) {
      console.log('There is already a user with this name in the database.');
      res.redirect('error', { message: 'There is already a user with this name in the database.' });
      return
    } else {
      newUser.username = req.body.username;
      newUser.pasword = req.body.password;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      newUser.password = hashedPassword;
      newUser.save()
        .then(() => {
          res.render('passport/login');
        })
        .catch((err) => {
          next();
          return err
        });
    }



  })
  .catch()

});

module.exports = passportRouter;