const express = require('express');
const passport = require('passport');
const { createSendToken } = require('./../Controllers/googleController');

const userRouter = express.Router();

// Google OAuth Route
userRouter.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Google OAuth Callback
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
    session: true
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:3000");
    }

    createSendToken(req.user, 200, res); // Set JWT cookie
    res.redirect("http://localhost:3000"); // Redirect to homepage after login
  }
);

module.exports = userRouter;