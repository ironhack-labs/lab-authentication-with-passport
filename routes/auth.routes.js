const express = require('express');
const User = require('../models/user.model');
const router = express.Router();
const bcrypt=require('bcrypt');
const passport=require('passport')
const { replaceOne } = require('../models/user.model');
const bcryptSalt=10

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })




router.get('/private-page', (req, res) => {
  res.render('passport/private', { user: req.user });
});


router.get('/signup',(req,res)=>res.render('auth/signup'))

router.post('/signup',(req,res,next)=>{

    const {username, password} = req.body

if(username.length === 0 || password.length === 0){
    res.render('auth/signup',{message: "Please enter username and password"})
    return
}


User.findOne({username})
.then(user=>{
    if(user){
        res.render('auth/signup',{message: "The user already exists"})
        return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.create({username,password:hashPass})
    .then(()=>res.redirect('/'))
    .catch(err=>next(err))

})
})



router.get('/login',(req,res,next)=>res.render('auth/login',{"message": req.flash("error")}))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



router.get('/logout',(req,res,next)=>{
    req.logout()
    res.redirect('/login')
})





module.exports = router;