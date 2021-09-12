const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
	app.set('trust proxy', 1);

	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: false,
			cookie: {
				sameSite: process.env.ENV === 'production' ? 'none' : 'lax',
				secure: process.env.ENV === 'production',
				httpOnly: true,
				maxAge: 600000 // 60 * 10 * 1000 ms === 10min
			},
			store: MongoStore.create({
				mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/auth-with-passport'
			})
		})
	);
};
