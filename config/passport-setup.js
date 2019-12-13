const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy from Google+ API in google dev console
      // step: 2 - automatically knows the root URL
      callbackURL: "/auth/google/redirect",
      // step: 1
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      // console.log("passport callback function fired");
      // console.log(profile);

      // check if user already exists in our database
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          // already have the user
          console.log("user is: " + currentUser);
          done(null, currentUser);
        } else {
          // if user doesn't exist create a new user in our database
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture
          })
            .save()
            .then(newUser => {
              console.log("new user created: " + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
