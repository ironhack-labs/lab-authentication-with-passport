const passport = require('passport');
const path = require('path');
const debugPath = "app:"+path.basename(__filename).split('.')[0];
const debug = require('debug')(debugPath);
const User = require('../models/User');


passport.serializeUser((user, cb) => {
  debug('Serialize User');
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    debug('Deserialize User');
    cb(null, user);
  });
});
