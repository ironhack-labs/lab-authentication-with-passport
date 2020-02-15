require("dotenv").config();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("./../../models/user");

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/spotify/callback"
    },
    async function(accessToken, refreshToken, expires_in, profile, done) {
      console.log(profile);
      const existingUser = await User.findOne({ spotifyId: profile.id });
      if (existingUser) {
        existingUser.username = profile.username;
        existingUser.spotifyToken = accessToken;
        await existingUser.save();
        return done(null, existingUser);
      } else {
        const newUser = await User.create({
          username: profile.username,
          spotifyId: profile.id,
          spotifyToken: accessToken
        });
        return done(null, newUser);
      }
    }
  )
);
