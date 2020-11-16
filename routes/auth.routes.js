const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user.model')

const bcrypt = require('bcryptjs')
const bcryptSalt = 10




// Register (render form)
router.get('/signup', (req, res) => res.render('auth/signup'))

// Register (manage form)

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('auth/signup', { errorMsg: 'Please, fill in all fields.' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup', { errorMsg: 'User already registered.' })
                return
            }
            
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render('auth/signup', { errorMsg: 'There was an error' }))
             
        })
    
        .catch(err => next(err))

})

// Log In (render form)

router.get('/login', (req, res) => res.render('auth/login', { errorMsg: req.flash('error') }))

// Log In (manage form)

router.post('/login', passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


// Log Out
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router