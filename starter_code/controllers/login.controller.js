const passport = require('passport');

module.exports.create = (req, res, next) => {
    res.render('passport/login');
}

