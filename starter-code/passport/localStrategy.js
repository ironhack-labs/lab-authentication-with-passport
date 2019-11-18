const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require('bcrypt')

passport.use(
    new LocalStrategy(
        {
            passReqToCallback: true
        },
        (req, username, password, next) => {
            User.findOne(
                {
                    username
                },
                (err, user) => {
                    if (err) {
                        return next(err);
                    }

                    if (!user) {
                        return next(null, false, {
                            message: "Incorrect username"
                        });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return next(null, false, {
                            message: "Incorrect password"
                        });
                    }

                    return next(null, user);
                }
            );
        }
    )
);