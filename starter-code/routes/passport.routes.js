const express = require("express");
const passportRouter = express.Router();
const passport = require("passport")
const flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
// Require user model

const User = require('../models/user')

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// Add bcrypt to encrypt passwords


const bcrypt = require('bcrypt')
const bcryptSalt = 10;

passport.serializeUser((user, cb) => cb(null, user._id));
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
// Add passport 
passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
  User.findOne({ username })
    .then(theUser => {
      // console.log(theUser, "estamos en el local`strategy")
      if (!theUser) return next(null, false, { message: "Nombre de usuario incorrecto" })
      if (!bcrypt.compareSync(password, theUser.password)) return next(null, false, { message: "Contraseña incorrecta" })
      return next(null, theUser);
    })
    .catch(err => next(err))
}))



passportRouter.get('/signup', (req, res) => res.render('passport/signup'));



passportRouter.post('/signup', (req, res) => {

  const { username, password } = req.body

  if (!username || !password) {
    res.render('passport/signup', { errorMessage: 'ERROR: Rellena los dos campos' })
    return
  }

  User.findOne({ "username": username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { errorMessage: "El nombre de usuario ya existe" })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
    })
    .catch(error => { console.log(error) })
})




passportRouter.get("/private", (req, res) => {
  console.log(req.user)
  // console.log('al menos lo intento', req.session.passport.user)
  res.render("passport/private", { user: req.session.passport.user })
});


passportRouter.get("/login", (req, res) => res.render("passport/login", { "message": req.flash("error") }));

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));





// passportRouter.get('/logout', (req, res) => {
//   req.logout()
//   res.redirect("/login")
// })




passportRouter.get("/logout", (req, res, next) => {
  req.session.destroy((err) => res.redirect("/login"));
});






module.exports = passportRouter;