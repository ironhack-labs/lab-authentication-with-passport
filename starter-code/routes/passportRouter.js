const express = require('express')
const passportRouter = express.Router()
const bcryptjs = require('bcryptjs')
const passport = require('passport')

// Require user model
const User = require('../models/user')

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login')

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('passport/private', { user: req.user })
})

passportRouter.get('/signup', (req, res) => {
    res.render('passport/signup')
})

passportRouter.post('/signup', (req, res) => {
    const { username, password } = req.body
    const salt = bcryptjs.genSaltSync()
    const hashPassword = bcryptjs.hashSync(password, salt)

    if (username === '' || password === '') {
        res.render('passport/signup', {
            errorMessage: 'You need a username and a password to register'
        })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                console.log('Username taken: ', user.username)
                res.render('passport/signup', {
                    errorMessage: 'There is already a registered user with this username'
                })
                return
            }
            User.create({ username, password: hashPassword })
                .then(() => {
                    res.redirect('/')
                })
                .catch(err => {
                    console.error('Error while creating user', err)
                })
        })
        .catch(err => {
            console.error('Error while looking for user', err)
        })
})

passportRouter.get('/login', (req, res) => {
    res.render('passport/login', { errorMessage: req.flash('error') })
})

passportRouter.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/private-page',
        failureRedirect: '/login',
        failureFlash: true,
        passReqToCallback: true
    })
)

// passportRouter.post('/login', (req, res, next) => {
//     // console.log('Hello')
//     const { username, password } = req.body
//     if (username === '' || password === '') {
//         res.render('passport/login', {
//             errorMessage: 'You need a username and a password to login'
//         })
//         return
//     }

//     User.findOne({ username })
//         .then(user => {
//             if (!user) {
//                 res.render('passport/login', {
//                     errorMessage: 'This username was not found'
//                 })
//             }
//             if (bcryptjs.compareSync(password, user.password)) {
//                 // req.session.loggedInUser = user
//                 res.redirect('/')
//             } else {
//                 res.render('passport/login', {
//                     errorMessage: 'Wrong password'
//                 })
//             }
//         })
//         .catch(err => {
//             console.error('Error while finding user', err)
//         })
// })

module.exports = passportRouter
