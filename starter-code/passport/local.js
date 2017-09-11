const bcrypt = require("bcrypt");
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require("passport-local").Strategy;
const path = require('path');
const debugPath = "app:"+path.basename(__filename).split('.')[0];
const debug = require('debug')(debugPath);
const flash = require('connect-flash')



passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));
