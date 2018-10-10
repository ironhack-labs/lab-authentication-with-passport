require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const
  bcrypt           = require(`bcrypt`),
  session          = require(`express-session`),
  flash            = require(`connect-flash`),
  passport         = require(`passport`),
  LocalStrategy    = require("passport-local").Strategy
;


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/security', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(`${__dirname}/views/partials`);

// Session
app.use(session({
  secret: `de-passport-auth`,
  cookie: { maxAge: 600000},
  resave: true,
  saveUninitialized: true
}));

// Define passport
const User = require(`./models/user`);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
});

app.use(flash());

passport
  .use(new LocalStrategy( {passReqToCallback: true}, (req, username, password, next) => {
    User
      .findOne({ username }, (err, user) => {
        if (err) return next(err);
        if (!user) return next(null, false, { message: `Incorrect username` });
        if (!bcrypt.compareSync(password, user.password)) return next(null, false, { message: `Incorrect password` });
      return next(null, user);
      })
    ;
  } ))
;

// Start passport
app
  .use(passport.initialize())
  .use(passport.session())
;

// Routes
const index = require('./routes/index');
const passportRouter = require("./routes/passportRouter");
app.use('/', index);
app.use('/', passportRouter);


module.exports = app;