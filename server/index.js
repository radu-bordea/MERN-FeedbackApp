// Import core libraries
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

// Import config and custom modules
const keys = require("./config/keys"); // Contains sensitive keys (Mongo URI, cookie key, etc.)
require("./models/User"); // Loads User model schema into Mongoose
require("./services/passport"); // Configures Passport strategies and serialization

// Connect to MongoDB using Mongoose
mongoose.connect(keys.mongoURI);

const app = express(); // Create an Express application

// Enable sessions (stores data like logged-in user ID in a cookie)
app.use(
  session({
    secret: keys.cookieKey, // Used to encrypt the cookie
    resave: false, // Don't force session save if unmodified
    saveUninitialized: false, // Don't create empty sessions
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 30 days
    },
  })
);

// Initialize Passport and tell it to use sessions
app.use(passport.initialize());
app.use(passport.session());

// Register authentication-related routes (login, logout, current user, etc.)
require("./routes/authRoutes")(app);

// Start the server on port 5000 or the environment's specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT);
