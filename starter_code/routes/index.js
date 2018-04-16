const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.user);
  console.log(req);
  res.render('index',{user:req.user});
});
module.exports = router;
