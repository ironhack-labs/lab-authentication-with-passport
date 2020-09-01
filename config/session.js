// Jalar requerimientos
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const passport = require('passport')

// Hacer el exports de la configuaración de session
module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60 * 60 *24
            })
        })
    )
    // Aqui también tenemos que inicializar passport
    app.use(passport.initialize())
    // Ligamos passport a la session que hemos definido arriba
    app.use(passport.session())
}
