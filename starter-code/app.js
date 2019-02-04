require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const passport     = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt       = require('bcrypt');
const User         = require("./models/user")


mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
  secret:"our-passport",
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
// local strategy
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({username})
  .then( user =>{
      if (!user) throw new Error("Incorrect Username");
      if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect Password");
      return next(null, user);
  })
  .catch(e => {
      next(null, false, {
          message: e.message
      })
  })
}));
// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
} )

passport.deserializeUser((id, cbo) => {
  User.findById (id, (err, user) =>{
    if (err){
      return cb(err)
    }
    cbo (null, user)

    })
})


module.exports = app;
