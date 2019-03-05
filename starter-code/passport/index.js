const passport     = require("passport");
require("./localStartegy")
require("./serializers")

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
}