const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
      })
    })
  )
}