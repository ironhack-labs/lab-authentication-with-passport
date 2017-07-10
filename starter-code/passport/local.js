const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("local").Strategy;

// Sirve para que de una cookie que nos llega convertirla a un usuario
passport.serializeUser((user, cb) => {  // cb == callback primer parametro es el Error
  cb(null, user.id);
});

// Cuando viene usuario convierte el id en un obj User y llama a ese callback con ese obj
passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Este middleware se instala en una ruta concreta POST. Es como una aduana deja pasar cuando le pasamos Next(null, user);
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    // Si existe continua con next pero tambien muestra un ERROR.
    if (!user) {
      // null nos indica que NO hay err, false es que no ha llegado objeto y NO puede pasar
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


module.exports = passport;
