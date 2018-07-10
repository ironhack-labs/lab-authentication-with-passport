const passport = require('passport');
require('./serializer');
require('./localstrat');


module.exports = (app) =>{
    app.use(passport.initialize());
    app.use(passport.session());
} 