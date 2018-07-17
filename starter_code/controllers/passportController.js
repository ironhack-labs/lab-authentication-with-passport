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
console.log('aquí parece que entra?')
    function renderWithErrors (errors) {
        res.status(404).render('passport/login', {
            user: req.body,
            errors: errors
        })
    }
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password) {
       renderWithErrors({
           email: email ? undefined : 'Email is required',
           password: password ? undefined : 'Password is required'
       })
    } else {
        passport.authenticate('local-auth', (error, user, validation) => {
            if(error) {
                next(error);
            } else if(!user) {
                renderWithErrors(validation);
            } else {
                req.login(user, (error) => {
                    if(error) {
                        next(error);
                    } else {
                        res.redirect('/private-page');
                    }
                })
            }
        })(req, res, next);
    }
}

module.exports.privateCreate = (req, es, next) => {
    res.render('passport/private');
}