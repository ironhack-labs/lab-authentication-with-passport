const passport = require("passport");
require('./serialize');
require('./local-strategy');


const passportConfig = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = passportConfig;