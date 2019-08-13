const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");


passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Ingresa tu correo y password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "Ese Usuario ya existe, intenta uno nuevo!" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.render("passport/signup", { message: "Ha ocurrido un error!" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login' )
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('login');
})
module.exports = passportRouter;