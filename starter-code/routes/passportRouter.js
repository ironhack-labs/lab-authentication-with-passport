const express = require("express")
const passportRouter = express.Router()
// Require user model
const User = require("../models/User")

// Add passport
const passport = require("../config/passport")
const ensureLogin = require("connect-ensure-login")

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user })
  }
)
//cuando se escribe directo en url es método get, ¡tu lo escribes directo! - P.Valero (2019)
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup")
})

//cuando es .post no se ve, esta oculto - P. Valero (2019)
passportRouter.post("/signup", async (req, res, next) => {
  //los datos de un post viajan con body
  //extrae la informacion del formulario
  //toda la informacion del formulario esta dentro del body
  const { username, password } = req.body
  //con el modelo estamos creando un registro(documento) con la informacion del formulario
  await User.register({ username, password }, password)
  res.redirect("/login")
})

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login")
})
passportRouter.post(
  "/login",
  passport.authenticate("local"),
  (req, res, next) => {
    //hay que autenticar a la persona, checando la base de datos
    res.redirect("/private")
  }
)
//en la ruta private le pones un get para que deje pasar solamente a la personas que estan autenticadas
passportRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("passport/private", { user: req.user.username })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) next()
  else res.redirect("/login")
}

module.exports = passportRouter
