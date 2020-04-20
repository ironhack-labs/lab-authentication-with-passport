const passport = require("passport")
const session = require("express-session")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")

const User = require("../models/User.model")

module.exports = app => {

    app.use(session({
        secret: `${process.env.SECRET}`,
        resave: true,
        saveUninitialized: true
    }))

    passport.serializeUser((user, next) => next(null, user._id))
    passport.deserializeUser((id, next) => {
        User.findById(id)
            .then(foundUser => next(null, foundUser))
            .catch(error => next(error))
    })

    app.use(flash())

    passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
        User.findOne({ username })
            .then(foundUser => {
                if (!foundUser) {
                    return next(null, false, {message: "Nombre de usuario incorrecto"})
                }
                if (!bcrypt.compareSync(password, foundUser.password)) {
                    return next(null, false, {message: "Contraseña incorrecta"})
                }
                return next(null, foundUser)
            })
            .catch(error => next(error))
    }))

    app.use(passport.initialize())
    app.use(passport.session())

}