const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { deleteOne } = require('../models/User.model');
const UserModel = require('../models/User.model');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    const user = await UserModel.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { error: 'Invalid credentials.' });
    }
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id)
        .then(user => {
            delete user.password;
            if (user.password) user.password = null;
            done(null, user);
        })
        .catch(err => done(err));
});

module.exports = passport;