const User = require('../models/User.model')
const { hashSync, genSaltSync} = require('bcrypt')
const passport = require('../config/passport')



// SIGNIN

exports.showSignup = (req, res, next) => {
    res.render('auth/signup')
}
exports.runSignup = async (req, res, next) => {
    const {username, password} = req.body
    // Revisar si tenemos toda la información
    if(username === '' || password === ''){
        return res.render('auth/signup', {error: "Missing fields."})
    }
    // Revisar si ya hay un usuario existente con el mismo username
    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.render('auth/signup', {error: "Please try again"})
    }
    const hashPwd = hashSync(password, genSaltSync(12))
    await User.create({
        username, 
        password: hashPwd
    })
    res.render('auth/login')
}

// LOGIN

exports.showLogin = (req, res, next) => {
    res.render('auth/login')
}

exports.runLogin = passport.authenticate("local", {
    successRedirect: '/private',
    failureRedirect: '/login'
})

exports.private = (req, res, next) => {
    res.render('auth/private', req.user)
}