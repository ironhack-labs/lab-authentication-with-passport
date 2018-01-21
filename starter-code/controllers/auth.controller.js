const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

module.exports.signup = (req, res, next) => {
    res.render('passport/signup'); // lógica de rutas distinta aqui que en routes?
}

module.exports.doSignup = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user != null) {
                res.render('passport/signup', {
                    user: user,
                    error: { username: 'Username already exists' }
                });
            } else {
                user = new User(req.body);
                user.save()
                    .then(() => {
                        //req.flash('info', 'Successfully sign up, now you can login!');
                        res.redirect('/login'); // por qué no passport/login?
                    }).catch(error => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('passport/signup', {
                                user: user,
                                error: error.errors
                            });
                        } else {
                            next(error);
                        }
                    });
            }
        }).catch(error => next(error));
}

module.exports.login = (req, res, next) => {
    res.render('passport/login'//, {
        //flash: req.flash()
    //}
  );
}

module.exports.doLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.render('passport/login', {
            user: { username: username },
            error: {
                username: username ? '' : 'Username is required',
                password: password ? '' : 'Password is required'
            }
        });
    } else {
        passport.authenticate('local-auth', (error, user, validation) => {
            if (error) {
                next(error);
            } else if (!user) {
                res.render('passport/login', { error: validation });
            } else {
                req.login(user, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.redirect('/private');
                    }
                });
            }
        })(req, res, next);
    }
}

module.exports.logout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            req.logout();
            res.redirect("/private");
        }
    });
}
