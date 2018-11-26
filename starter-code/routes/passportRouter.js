const express        = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Add bcrypt to encrypt passwords

// Add passport 

function ensureLoggedIn(req, res, next) {
    console.log("Usuario?", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/auth/login");
}

//const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup',(req,res,next) => {
  res.render('passport/signup')
})

passportRouter.post('/signup',(req,res,next) =>{
    User.register(req.body, req.body.password)
        .then(user => {
            res.json(user);
        })
        .catch(e => next(e));
})

passportRouter.get('/login',(req,res,next)=>{
    res.render('passport/login')
})

passportRouter.post("/login", passport.authenticate("local"), (req, res, next) => {
    const username = req.user.username;
    res.send("Tu eres un usuario real con username: " + username);
});

passportRouter.get("/private-page", ensureLoggedIn, (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;