var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('~~~~~~~~~~ HOME ~~~~~~~~~~~');
  console.log('SESSION (from express-sessions middleware');
  console.log(req.session);
  console.log('\n');
  console.log('USER(from passport)');
  console.log(req.user);

if (req.user){
  res.render('passport/private');
}

  res.render('passport/private',{
    user: req.user
  });
});

module.exports = router;
