const passport = require("passport");
const model = require("../models/user");

// REQUIRE ALL STRATEGIES HERE!!!
require("./strategies/local");
// si quiero añadir más estrategias de Passport (como github o Steam) hay que hacerlo aquí

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  console.log("deserializing user");
  model
    .findById(id)
    .then(user => cb(null, user))
    .catch(e => cb(err));
});

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};