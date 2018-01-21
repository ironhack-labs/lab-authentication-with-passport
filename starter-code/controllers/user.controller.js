const User = require('../models/user');

module.exports.profile = (req, res, next) => {
    res.render('user/profile');
}

module.exports.list = (req, res, next) => {
    User.find({})
        .then(users => {
            res.render('user/list', {
                users: users
            });
        })
        .catch(error => next(error));
}
