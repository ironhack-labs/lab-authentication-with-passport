const express = require('express');
const router = express.Router();
const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

/* GET home page */
router.get('/', (req, res) => res.render('index'));
router.get('/private', ensureLoggedIn, (req, res) => res.render('auth/private', req.user))

module.exports = router;
