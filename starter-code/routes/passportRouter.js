const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10
// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', (req, res, next) => res.render('passport/signup'))

passportRouter.post('/signup', (req, res, next) => {

  const { username, password } = req.body 
 // console.log(req.body)

 if (username === "" || password === "") {
  res.render("passport/signup", { message: "Rellena todo" });
  return;
}

User.findOne({ username })
.then(user => {
    if (user) {
        res.render("passport/signup", { message: "El usuario ya existe" });
        return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
        username,
        password: hashPass
    });

    newUser.save((err) => {
        if (err) {
            res.render("passport/signup", { message: "Algo ha fallado" });
        } else {
            res.redirect("/");
        }
    });

})
.catch(error => {
    next(error)
})

})

module.exports = passportRouter;