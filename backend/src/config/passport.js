import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the same googleId or email already exists
        let existingUser = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails?.[0]?.value }]
        });

        if (existingUser) {
          // Link Google account if not already linked
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        }
        const user = new User({
          googleId: profile.id,
          ...(profile.name?.givenName && { firstName: profile.name.givenName }),
          ...(profile.name?.familyName && { lastName: profile.name.familyName }),
          username: profile.displayName,
          email: profile.emails?.[0]?.value
        });
        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
