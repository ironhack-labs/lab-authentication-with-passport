const mongoose = require('mongoose');
const passport= require('passport');
const User = require("../models/user");


module.exports.signupCreate = (req, res, next) => {
    res.render('passport/signup');
}
module.exports.signupDoCreate = (req, res, next) => {
    const email = req.body.email;

    User.findOne({ email: email })
        .then(user => {
            if(user) {
                res.render('passport/signup', {
                    user: req.body,
                    errors: { email: 'the email already exists' }
                })
            } else {
                console.info('2')
                user = new User(req.body)
                return user.save()
                    .then(user => {
                        res.redirect('/login');
                    })
            }
        })
        .catch(error => {
            if(error instanceof mongoose.Error.ValidationError) {
                res.render('passport/signup', {
                    user: req.body,
                    errors: error.errors
                })
            } else {
                next(error);
            }
        });
}

module.exports.loginCreate = (req, res, next) => {
    res.render('passport/login');
}
module.exports.loginDoCreate = (req, res, next) => {
    // const email = req.body.email;
    // const password = requ.body.password;
    // User.findOne({ email: email })
    //     .then(user=> {
    //         if(user) {
    //             pass
    //             res.redirect('private-page');
    //         } else{

    //         }
    //     })
}