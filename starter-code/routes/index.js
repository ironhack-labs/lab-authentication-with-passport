const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("FLASH REQ",req.locals);
  console.log("FLASH RES",JSON.stringify(res.locals));
  console.log("FLASH",req.flash());
  //console.log("SESSION",req.session);
  res.render('index');
});

module.exports = router;
