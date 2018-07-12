const mongoose = require('mongoose');
const passport = require("passport");
const User = require("../models/user");


module.exports.create = (req, res, next) => {
    res.render('passport/signup');
}
module.exports.doCreate = (req, res, next) => {
    const email = req.body.email;

    User.findOne({ email: email })
        .then(user => {
            if(user) {
                res.render('passport/signup', {
                    user: req.body,
                    errors: { email: 'the email already exists' }
                })
                console.info('1')
            } else {
                console.info('2')
                user = new User(req.body)
                return user.save()
                    .then(user => {
                        res.redirect('/private-page');
                        console.info('3')
                    })
            }
        })
        .catch(error => {
            if(error instanceof mongoose.Error.ValidationError) {
                console.info('4')
                res.render('passport/signup', {
                    user: req.body,
                    errors: error.errors
                })
            } else {
                next(error);
                console.info('5')
            }
        });
}