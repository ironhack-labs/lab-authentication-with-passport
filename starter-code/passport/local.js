const bcrypt = require("bcrypt");
const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require("passport-local").Strategy;
const path = require('path');
const debugPath = "app:"+path.basename(__filename).split('.')[0];
const debug = require('debug')(debugPath);


passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('Incorrect Username');
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log('Incorrect Password');
      return next(null, false, { message: "Incorrect password" });
    }
    console.log('Logged in user');
    return next(null, user);
  });
}));
