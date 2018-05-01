const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

router.get("/signup", (req,res,next) =>{
 //res.send("HOLLAAAAA")
 res.render("passport/signup")
})

router.post('/signup', (req,res,next)=>{
  if(req.body.pass1 !== req.body.pass2){
     return res.redirect("passport/signup")
  }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  req.body.password = bcrypt.hashSync(req.body.pass1, salt);

  User.create(req.body)
  .then(()=>res.redirect("/login"))

})

/*router.post("/signup", (req,res,next)=>{
if(req.body.pass1 !== req.body.pass2) return res.redirect("passport/signup")
  const salt = bcrypt.genSaltSync(bcryptSalt);
  req.body.password = bcrypt.hashSync(req.body.pass1, salt);
  User.create(req.body)
  .then(()=>res.redirect("passport/login"))
})*/

router.get("/login", (req,res,next)=>{
  res.render("passport/login")
})

router.post ("/login", (req, res, next)=>{
  User.findOne({username: req.body.username})
  .then(user =>{
   if (bcrypt.compareSync(req.body.password, user.password)){
    //req.session.currentUser = user;
    console.log(user)
    return res.render("passport/private", {user})
    //res.send(`Bienvenido ${req.body.username}`)
   }
   res.send("Tu contraseña es incorrecta")
  })
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = router;