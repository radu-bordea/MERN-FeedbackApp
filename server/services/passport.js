// Import Passport core and Google OAuth 2.0 strategy
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Import Mongoose and project-specific keys (secrets)
const mongoose = require("mongoose");
const keys = require("../config/keys");

// Get the User model from Mongoose (already registered in models/User.js)
const User = mongoose.model("users");

// Called when a user logs in: decide what user data to store in the session
passport.serializeUser((user, done) => {
  // Store only the user ID in the session (keeps session small)
  done(null, user.id);
});

// Called on every request to retrieve the full user object using the ID from session
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    // Attach the full user object to req.user
    done(null, user);
  });
});

// Register the Google OAuth strategy with Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID, // From your Google Developer Console
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback", // Where Google redirects after login
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if this Google profile ID already exists in our database
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // User already exists, proceed with that user
        return done(null, existingUser);
      }

      // If user doesn't exist, create a new user record
      const newUser = await new User({ googleId: profile.id }).save();
      done(null, newUser);
    }
  )
);
