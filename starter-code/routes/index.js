const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('Home---------------');
  console.log('SESSION (from express-session)');
  console.log(req.session);
  console.log('\n')
  console.log('USER (from passport)')
  console.log(req.user);
  res.render('index',{
    user:req.user
  });
});

module.exports = router;