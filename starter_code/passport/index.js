const passport = require("passport");
require("./serializers");
require("./local");

module.exports = (app) =>{
    app.use(passport.initialize());
    app.use(passport.session());
} 