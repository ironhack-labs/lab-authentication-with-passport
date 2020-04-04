const express       = require ('express')
const router        = express.Router();
const User          = require('../models/user')
const bcrypt        = require('bcrypt');
const bcryptSalt    = 10;
const passport      = require('passport')
const ensureLogin   = require('connect-ensure-login');
const flash         = require('connect-flash')


//route for Home Page

router.get('/', (req,res,next) =>{
    res.render('index')
})

//route for logout

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/')
})


//Routes for Signup

router.get('/signup', (req,res,next) =>{
    res.render('auth/signup')
})



router.post('/signup', (req,res,next) => {
    const username  = req.body.username
    const password  = req.body.password
    const email     = req.body.email

    if(!username || !password){
        res.render('auth/signup', {message: 'Fill in the username and password'});
        return;
    }

    User.findOne({username})
    .then(user => {
        if(user !== null){
            res.render('auth/signup', {message: 'Username already exists !!'});
            return;
        }
        
        const salt          = bcrypt.genSaltSync(bcryptSalt)
        const hashPass      = bcrypt.hashSync(password, salt);
        
        const newUser = new User ({
            username, 
            password: hashPass,
            email
        })
        return newUser.save();
    })
    .then(() => {
        res.redirect('/');
    })
    .catch(error => {
        res.render('auth/signup', {message: 'Something went wrong'})
    });
});



//Routes for Login

router.get('/login', (req,res,next) => {
    res.render('auth/login', {message: req.flash('error')})
})

router.post(
    '/login', 
    passport.authenticate('local', {
        successRedirect: '/member',
        failureRedirect: '/login', 
        failureFlash: true,
        passReqToCallback: true
    })
); 


//routes for member 
router.get('/member', ensureLogin.ensureLoggedIn(), (req,res) => {
    res.render('auth/member', {user: req.user} )
})


module.exports = router;