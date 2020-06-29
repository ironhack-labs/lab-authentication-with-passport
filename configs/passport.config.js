const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

//const flash = require("connect-flash") // Error handling


module.exports = app => {

    app.use(session({
        secret: "passAuthor",
        resave: true,
        saveUninitialized: true
    }))

    passport.serializeUser((user, cb) => cb(null, user._id))

    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            if (err) {
                return cb(err)
            }
            cb(null, user)
        })
    })

    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, (req, username, password, next) => {
        User.findOne({
            username
        }, (err, user) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return next(null, false, {
                    message: "Usuario inexistente"
                });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return next(null, false, {
                    message: "Contraseña incorrecta"
                });
            }
            return next(null, user)
        })
    }))

    app.use(passport.initialize())
    app.use(passport.session())



}