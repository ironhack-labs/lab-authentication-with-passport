const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");

const User = require('../models/user');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
    .then(user => {
        if(!user) {
            return done(null, false, {message: 'Incorrect Username.'})
        } else if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Incorrect password.'})
        } else {
            return done(null, user);
        }
    })
    .catch(err => done(null, false, {message: err}))
  }
));