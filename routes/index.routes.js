const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));

// Logged in checker
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')


// Endpoints
router.get('/', (req, res) => {
    console.log('¿Está el usuario logeado?', req.isAuthenticated())
    res.render('index')
})

router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', {
        user: req.user
    })
})


module.exports = router;