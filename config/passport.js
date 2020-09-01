const passport = require('passport')
const User = require('../models/User.model')
const LocalStrategy = require('passport-local').Strategy
const {compareSync} = require('bcrypt')

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
async (username, password, done) => {
    // Como vamos a ir a la base de datos tenemos que poner un try and catch
    try{
        // Revisar si el usuraio esta dado de alta en nuestra base de datos
        const user = await User.findOne({username})
        if(!user) return done(null, false, {message: "Incorrect Username"})
        // Revisar si la contraseña es la correcta
        if(!compareSync(password, user.password)) return done(null, false, {message: 'Incorrect password'})
        // Si ya pasa las dos pruebas anteriores, hay que usar done para enviar lso datos al req.user
        done(null, user)
    }catch (error){
        console.log(`THIS IS THE ${error}`)
        done(error)
    }
}))

// Serialize recibe el done del callback de la instancia de LocalStrategy
// Hace falta serializar al usuario para sacarle su id para después pasarselo al deserialize 
passport.serializeUser((user, done) => {
    done(null, user)
})
// En esta funcion tomamos el done del serialize y lo usamos para extraer sólo lo que necesitemos del la base de datos
passport.deserializeUser(async (id, done) => {
    try{
        // En ese ejemplo sólo vamos a necesitar el username, por eso destructuramos
        const {username} = await User.findById(id)
        // Pasamos el done con la información recabada, ese done pasará como argumento para lo que se venga en la ruta
        done(null, {username})
    }catch(error){
        console.log(error)
        done(error)
    }
})

// Muy importante exportar esta configuración pq si no lo hacmos no se va a poner acceder a esta parte del código
module.exports = passport