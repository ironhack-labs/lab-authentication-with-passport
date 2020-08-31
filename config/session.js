  
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
          ttl: 60 * 60 * 24
        })
      })
    )
    // inicializamos passport
    app.use(passport.initialize())
    // ligamos a passport a la sesion que definimos arriba
    app.use(passport.session())
  }