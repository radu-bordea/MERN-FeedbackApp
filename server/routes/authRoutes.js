// Import Passport (which has the Google strategy already configured)
const passport = require("passport");

module.exports = (app) => {
  // Route that starts the Google OAuth flow
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"], // Ask Google for access to user's profile and email
    })
  );

  // Google redirects the user back here after they grant permission
  // Passport uses the code in the URL to fetch user profile data
  app.get(
    "/auth/google/callback",
    passport.authenticate("google") // Continues to the strategy logic you wrote earlier
  );

  // Logs the user out and clears their session
  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err); // Handle any logout errors
      res.send({ success: true }); // Confirm successful logout
    });
  });

  // Returns the current logged-in user (if any)
  app.get("/api/current_user", (req, res) => {
    res.send(req.user); // Will be undefined if no user is logged in
  });
};
