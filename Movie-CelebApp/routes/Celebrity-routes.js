const express = require('express');
const router  = express.Router();
const Celebrity  = require('../models/Celebrity');




router.get('/Celebritys', (req, res, next)=>{
    Celebrity.find()
    .then((Celebritys)=>{
        res.render('Celebrity-views/Celebrity-index', {Celebritys})
    })
    .catch((err)=>{
        next(err);
    })
})


router.get('/Celebritys/new', (req, res, next)=>{
    res.render('Celebrity-views/add-new-Celebrity')
})

router.post('/Celebritys/create', (req, res, next)=>{
    Celebrity.create(req.body)
    .then(()=>{
        res.redirect('/Celebritys');
    })
    .catch((err)=>{
        next(err);
    })
})

module.exports = router;
