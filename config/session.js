const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const mongoose = require("mongoose")
const passport = require("./passport")

module.exports = app => {
    app.use(
        session({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60 * 5
            })
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())
}