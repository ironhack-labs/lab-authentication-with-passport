const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", {
        user: req.user
    });
});


router.get('/signup',ensureLogin.ensureNotLoggedIn(), (req, res, next) => {
    res.render('passport/signup.ejs');
});
// ensureLogin.ensureNotLoggedIn(),
router.post('/signup',ensureLogin.ensureNotLoggedIn(), (req, res, next) => {
    const userName = req.body.usernameValue;
    const passWord = req.body.passwordValue;

    if (!userName || !passWord) {
        res.render('passport/signup.ejs', {
            errorMessage: "please provide an username and a passwords"
        });
        return;
    }
    if (userName) {
        User.findOne({
            username: userName
        }, {
            username: 1
        }, (err, founduser) => {
            if (err) {
                next(err);
                return;
            }
            if (founduser) {
                res.render('passport/signup.ejs', {
                    errorMessage: "please provide another Username your is takens"
                });
                return;
            }
        });
    }

    if (passWord.length < 6 || passWord.lenght > 33) {
        res.render('passport/signup.ejs', {
            errorMessage: ['Please provie a password beteween 6-32 characters']
        });
        return;
    }
    if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(passWord) === false) {
        res.render('passport/signup.ejs', {
            errorMessage: ['Please make sure your password has at least one number one lower case and special characters']
        });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(passWord, salt);
    const theUser = new User({
        username: userName,
        password: passWord
    });
    theUser.save((err) => {
        if (err) {
            next(err);
        }
        res.redirect('/');
    });
});

router.get('/login',ensureLogin.ensureNotLoggedIn(), (req, res, next) => {
    res.render('passport/login.ejs');
});
router.post('/login',ensureLogin.ensureNotLoggedIn(), passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
router.get('/logout',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
