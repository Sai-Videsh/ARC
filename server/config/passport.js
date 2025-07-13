const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy; // ✅ NEW: Import Facebook Strategy
const User = require('../models/User');

// 🧠 Serialize user (store user id in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 🧠 Deserialize user (find user by id)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 🔑 Google Strategy setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // Create user if not exists
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true, // ✅ Skip OTP since it's verified by Google
      });
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// 🔑 Facebook Strategy setup (NEW)
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:5000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails'], // Request name and email
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook profile:', profile); // Debug log
    // Check for existing user by facebookId or email
    let user = await User.findOne({ facebookId: profile.id });
    if (!user && profile.emails && profile.emails[0]) {
      user = await User.findOne({ email: profile.emails[0].value });
    }

    if (user) {
      // Update existing user with facebookId if not linked
      if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    const newUser = new User({
      name: profile.displayName,
      email: profile.emails ? profile.emails[0].value : `fb_${profile.id}@noemail.com`, // Fallback email
      facebookId: profile.id,
      isVerified: true, // Skip OTP since verified by Facebook
    });
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    console.error('Facebook auth error:', err);
    return done(err, null);
  }
}));