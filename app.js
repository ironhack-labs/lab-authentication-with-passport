// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// session configuration

const session = require('express-session');
const MongoStore = require('connect-mongo');
const DB_URL = process.env.MONGODB_URI;

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		// for how long is a user automatically logged in 
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
		saveUninitialized: false,
		resave: true,
		store: MongoStore.create({
			mongoUrl: DB_URL
		})
	})
)

// end of session configuration

// passport config

const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then(userFromDB => {
			done(null, userFromDB);
		})
		.catch(err => {
			done(err);
		})
})


// register the local strategy (login with username and password)

passport.use(
	new LocalStrategy((username, password, done) => {
		// this logic will be executed when we log in
		User.findOne({ username: username })
			.then(userFromDB => {
				if (userFromDB === null) {
					// there is no user with this username
					done(null, false, { message: 'Wrong Credentials' });
				} else {
					done(null, userFromDB);
				}
			})
	})
)

app.use(passport.initialize());
app.use(passport.session());

// end of passport config


// passport - github strategy

const GithubStrategy = require('passport-github').Strategy;

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			// console.log(profile);
			// authentication on github passed and we need to check if we have 
			// a user with that github id already in the database - if not we create it
			User.findOne({ githubId: profile.id })
				.then(userFromDB => {
					if (userFromDB !== null) {
						// pass the user to passport so it can be serialized and it's id 
						// is put into the session
						done(null, userFromDB);
					} else {
						// we create that user
						User.create({ githubId: profile.id, username: profile.username, avatar: profile._json.avatar_url })
							.then(userFromDB => {
								done(null, userFromDB);
							})
					}
				})
				.catch(err => {
					done(err);
				})
		}
	)
)

// end of passport - github strategy

// Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

// require('dotenv').config();

// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const express = require('express');
// const favicon = require('serve-favicon');
// const hbs = require('hbs');
// const mongoose = require('mongoose');
// const logger = require('morgan');
// const path = require('path');

// mongoose
//   .connect(`${process.env.MONGODB_URI}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
//   })
//   .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
//   .catch(err => console.error('Error connecting to mongo', err));

// const app_name = require('./package.json').name;
// const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// const app = express();

// // Middleware Setup
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// // Express View engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// // Routes middleware goes here
// const index = require('./routes');
// app.use('/', index);
// const authRoutes = require('./routes/auth');
// app.use('/', authRoutes);

// // passport config
// const User = require('./models/User');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');

// passport.serializeUser((user, done) => {
// 	done(null, user._id);
// });

// passport.deserializeUser((id, done) => {
// 	User.findById(id)
// 		.then(userFromDB => {
// 			done(null, userFromDB);
// 		})
// 		.catch(err => {
// 			done(err);
// 		})
// })

// // // register the local strategy (login with username and password)
// // passport.use(
// // 	new LocalStrategy((username, password, done) => {
// // 		// this logic will be executed when we log in
// // 		User.findOne({ username: username })
// // 			.then(userFromDB => {
// // 				if (userFromDB === null) {
// // 					// there is no user with this username
// // 					done(null, false, { message: 'Wrong credentials' });
// // 				} else {
// // 					done(null, userFromDB);
// // 				}
// // 			})
// // 	})
// // )

// app.use(passport.initialize());
// app.use(passport.session());
// // end of passport config

// // passport - github strategy
// const GithubStrategy = require('passport-github').Strategy;

// passport.use(
// 	new GithubStrategy(
// 		{
// 			clientID: process.env.GITHUB_ID,
// 			clientSecret: process.env.GITHUB_SECRET,
// 			callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
// 		},
// 		(accessToken, refreshToken, profile, done) => {
// 			// console.log(profile);
// 			// authentication on github passed and we need to check if we have 
// 			// a user with that github id already in the database - if not we create it
// 			User.findOne({ githubId: profile.id })
// 				.then(userFromDB => {
// 					if (userFromDB !== null) {
// 						// pass the user to passport so it can be serialized and its id 
// 						// is put into the session
// 						done(null, userFromDB);
// 					} else {
// 						// we create that user
// 						User.create({ githubId: profile.id, username: profile.username })
// 							.then(userFromDB => {
// 								done(null, userFromDB);
// 							})
// 					}
// 				})
// 				.catch(err => {
// 					done(err);
// 				})
// 		}
// 	)
// )
// // end of passport - github strategy

// module.exports = app;
