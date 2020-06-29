const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const ensureLogin = require('connect-ensure-login')
const User = require('../models/User.model')

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')


//SIGNUP

router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res) => {
  const { username, password } = req.body

  if (username.length === 0 || password.length === 0) {
    res.render('auth/signup', { errMsg: 'Complete the fields' })
    return
  }

  User
    .findOne({ username })
    .then(user => { if (user) { res.render("auth/signupensureLoggedIn", { errMsg: "This user already exists"
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

        return 
      
      User.create({ username, password: hashPass })
      .then(() => res.redirect('/'))
      .catch(err => console.log("Error!:", err))
    })
    .catch(err => nexterror)
})

//LOGIN

router.get('/login', (req, res) => res.render('auth/login', {'message': req.flash('error')}))
router.post( "/login",  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  }))

const { restart } = require('nodemon')


router.get('/private', checkAuthenticated, (req, res) => res.render('auth/private', { user: req.user }))

module.exports = router
