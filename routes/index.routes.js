const express = require('express');
const router = express.Router();

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get('/private', checkAuthenticated, (req, res) => {
    res.render('auth/private', { user: req.user })
})



module.exports = router;
