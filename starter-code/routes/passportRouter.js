const express        = require("express");
const passportRouter = express.Router();
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')
// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcryptjs')
const bcryptSalt = 10;

// Add passport
passportRouter.get('/', (req,res,next) => {
  res.render('index')
})
passportRouter.get('/login', (req,res,next) => {
  res.render('passport/login', { 'message': req.flash('error')})
})

passportRouter.post('/login', passport.authenticate ('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));
passportRouter.get('/signup', (req,res,next) => {
  res.render('passport/signup')
})
passportRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
 });
passportRouter.post('/signup', (req,res,next ) => {
  const username = req.body.username
  const password = req.body.password

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});
module.exports = passportRouter;