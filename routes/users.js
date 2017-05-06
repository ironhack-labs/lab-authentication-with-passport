const express     = require('express');
const ensure      = require("connect-ensure-login");
const router      = express.Router();

// ensure.ensureLoggedIn();
//
//
// router.get('/profile/edit',
//   //redirects to login if you are NOT logged in
//   ensure.ensureLoggedIn('/login'),
//   (req, res, next)=>{
//   if(!req.user) {
//     res.redirect('/login');
//     return;
//   }
//   res.render('passport/edit-profile-view.ejs');
// });

module.exports    = router;
