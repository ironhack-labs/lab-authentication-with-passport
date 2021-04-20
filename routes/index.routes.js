const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get('/profile', (req, res) => {
    res.render('profile', { user: req.user })
})

module.exports = router;
