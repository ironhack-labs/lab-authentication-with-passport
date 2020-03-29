const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));

// added lines below

// router.get('/signup', (req, res, next) => {
//     res.render('auth/signup.hbs')
//   })
  
//   router.post('/signup', (req, res, next) => {
//     const {
//       username,
//       password
//     } = req.body;
  
//     if (!username || !password) {
//       res.render('auth/signup', {
//         message: 'Indicate username and password if you wanna enter this darkness'
//       });
//       return;
//     }
  
//     User.findOne({
//         username
//       })
//       .then(user => {
//         if (user !== null) {
//           res.render('auth/signup', {
//             message: 'The username already exists - Ha! Ha!'
//           });
//           return;
//         }
  
//         const salt = bcrypt.genSaltSync(bcryptSalt);
//         const hashPass = bcrypt.hashSync(password, salt);
  
//         const newUser = new User({
//           username,
//           password: hashPass
//         });
  
//         return newUser.save();
//       })
//       .then(() => {
//         res.redirect('/');
//       })
//       .catch(error => {
//         res.render('auth/signup', {
//           message: 'Something went wrong'
//         });
//       });
//   });
  
//   router.get('/login', (req, res, next) => {
//     res.render('auth/login', {
//       message: req.flash('error')
//     });
//   });
  
//   router.post(
//     '/login',
//     passport.authenticate('local', {
//       successRedirect: '/',
//       failureRedirect: '/login',
//       failureFlash: true,
//       passReqToCallback: true
//     })
//   );
  
//   router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
//     res.render('auth/private', {
//       user: req.user
//     });
//   });
  
//   router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/login');
//   });

module.exports = router;
