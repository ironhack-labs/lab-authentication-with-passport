const express = require('express');
const router = express.Router();

const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

router.get('/private', ensureLoggedIn, (req, res) => res.render('auth/private', req.user))


/* GET home page */
router.get('/', (req, res) => res.render('index'));



module.exports = router;
