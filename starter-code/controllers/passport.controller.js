// User model
const User = require("../models/user");
// Mongoose
const mongoose = require('mongoose');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");

module.exports.signup = (req, res) => {
    res.render("passport/signup", { user: req.user });
};

module.exports.doSignup = (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user != null) {
                res.render('passport/signup', {
                    user: req.body,
                    error: { username: 'Username already exists'}
                });
            }
            else {
                /*
                let user = {
                    username: req.body.username,
                    password: req.body.password
                }
                User.create(user, () => {
                    res.status(200);
                })
                */
                user = new User(req.body);
                user.save()
                    .then(() => {
                        //res.status(200);
                        res.send("User created OK");
                    })
                    .catch((error) => {
                        res.send('Error al crear usuario');
                    })
            }
        })
        .catch((error) => {
            res.send("ERROR: " + error);
        })
};

module.exports.login = (req, res) => {
    res.render("passport/login");
};

module.exports.doLogin = (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user != null) {
                res.render("passport/private", { user: req.body });
            }
            else {
                res.render('passport/login', {
                    error: {
                        password: "Username or password incorrect"
                    }
                });
            }
        })
};

module.exports.privatePage = (req, res) => {
    // res.send(req.user);
    res.render("passport/private", { user: req.user });
};