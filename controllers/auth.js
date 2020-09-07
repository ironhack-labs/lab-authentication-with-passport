const User = require("../models/User.model")
const { hashSync, genSaltSync } = require("bcryptjs");
const passport = require("../config/passport");

exports.signupView = (req, res) => {
    res.render('auth/signup');
}

exports.signupAuth = async(req, res) => {
    //Decons req
    const { email, password } = req.body;
    //Check if some input is empty
    if (email === '' || password === '') {
        return res.render('auth/signup', { error: "Missing fields." })
    }
    //Find if User already exist
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.render("auth/signup", { error: "Error, something goes wrong, try one more time." })
    }
    //Encrypt Pass an create new User
    const encryptedPassword = hashSync(password, genSaltSync(12))
    await User.create({
            email,
            password: encryptedPassword
        })
        //Redirect to loggin
    res.render('auth/login');
};

exports.loginView = (req, res) => {
    res.render('auth/login');
};

exports.loginAuth = passport.authenticate('local', {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true
})

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/')
}

exports.private = (req, res) => {
    res.render('auth/private', { user: req.user });
}