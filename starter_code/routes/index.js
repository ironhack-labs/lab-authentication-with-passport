const express = require('express');
const router  = express.Router();
const passport = require("passport");
require('./serializers');
require('./localStrategy');

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}
