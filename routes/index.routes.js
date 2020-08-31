const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {

    let isLogged = false

    if(req.user)
        isLogged = true

    res.render('index', {isLogged})

});

router.get('/fail', (req, res) => res.render('fail'));

module.exports = router;
