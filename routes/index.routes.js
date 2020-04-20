const express = require('express');
const router = express.Router();

// Session Detector
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')


/* GET home page */
router.get('/', (req, res) => res.render('index'));




// GET Private Route
router.get('/private', isLoggedIn, (req, res, next) => res.render('auth/private', req.user ))

module.exports = router;
