require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const flash = require("flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const dbUrl = process.env.MONGODB_URL

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;


const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());


app.use(session({
  secret: "my-cat-has-three-legs",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
  mongooseConnection: mongoose.connection
  })
})); 


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

app.use(flash());

passport.use(
  new LocalStrategy({
      passReqToCallback: true
    },
    (req, username, password, callback) => {
      User.findOne({
          username
        })
        .then(user => {
          if (!user || !bcrypt.compareSync(password, user.password)) {
            return callback(null, false, {
              message: "Insert Username and Password again"
            });
          }
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);


app.use(passport.initialize());
app.use(passport.session());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


app.locals.title = 'Authentication with passport';


const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);


module.exports = app;
