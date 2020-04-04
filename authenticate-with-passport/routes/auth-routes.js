const express       = require ('express')
const router        = express.Router();
const User          = require('../models/user')
const bcrypt        = require('bcrypt');
const bcryptSalt    = 10


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






module.exports = router;