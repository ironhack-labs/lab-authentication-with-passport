const passport = require("passport");
require('./serializer');
require('./localStrategy');

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}