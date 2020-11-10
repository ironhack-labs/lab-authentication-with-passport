const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const mongoose = require("mongoose")

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
