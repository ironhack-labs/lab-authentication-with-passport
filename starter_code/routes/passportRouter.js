const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get('/signup', (req,res,next)=>{
  res.render('passport/signup');
});

router.post('/process-signup', (req,res,next)=> {
  const {username, password} = req.body

  if(password==="" || password.match(/[0-9]/)=== null){
    // req.flash("error", "Your password must have at least a number");
    res.redirect("/signup");
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const  encryptedPassword = bcrypt.hashSync(password, salt);
  
  User.create({username, encryptedPassword})
    .then(()=>{
      // req.flash("success", " You have signed up! Try logging in. ");
      res.redirect('/');
    })
    .catch((err)=>{
      next(err);
    });
});

router.get('/login', (req,res,next)=>{
  res.render('passport/login');
});

router.post('/process-login', (req,res,next)=>{
  const {username, password} = req.body;

  User.findOne({username})
    .then((userDetails)=>{
      if(!userDetails){
        // req.flash("error", "Wrong email");        
        res.redirect("/login");
        return;
      }
      const {encryptedPassword} = userDetails;

      if(!bcrypt.compareSync(password,encryptedPassword)) {
        // req.flash("error", "Wrong password");                
        res.redirect('/login');
        return;
      }

      req.login(userDetails, () => {
        
        // req.flash("success", "log in successfull");                
        res.redirect("/");
      });
      // req.session.isloggedIn = true;
     
    })
    .catch((err)=>{
      next(err);
    });
  // res.send(req.body);
});


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;