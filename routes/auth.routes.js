const express = require('express');
const router = express.Router();
const session = require("express-session")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")(session)
// Require user model
const User = require("../models/User.model")
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
// Add passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const ensureLogin = require('connect-ensure-login');


//-------------Session------------
module.exports = app => {
  app.use(
    session({
      secret: "sertyuiknbvcde567ujnbvfr67uhv",
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      }),
      resave: true,
      saveUninitialized: true
    })
  )
}

//------------Passport-------
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      const user = await User.findOne({ email })
      if (!user) {
        return done(null, false, { message: "Incorrect email" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" })
      }

      done(null, user)
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id)
  user.password = null
  cb(null, user) 
})



const {
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  privatePage,
  logout
} = require("../controller/auth")



router.get("/", (req, res, next) => {
  console.log(req.user)
  res.render("index")
  next()
})

//====================Auth====================





router.get("/signup", signupView)
router.post("/signup", signupProcess)
router.get("/login", loginView)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))
router.post("/login", loginProcess)

// router.get("/private-page", privatePage)

router.get("/logout", logout)










router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
