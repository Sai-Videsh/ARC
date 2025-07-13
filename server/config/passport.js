// server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// 🧠 Serialize user (store user id in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 🧠 Deserialize user (find user by id)
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID); // Should NOT be undefined


// 🔑 Google Strategy setup
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,     // put in .env
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET, // put in .env
//   callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     const existingUser = await User.findOne({ googleId: profile.id });
//     if (existingUser) return done(null, existingUser);

//     // 👤 Create new user
//     const newUser = await new User({
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       googleId: profile.id,
//       isVerified: true,
//     }).save();

//     done(null, newUser);
//   } catch (err) {
//     done(err, null);
//   }
// }));

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
        isVerified: true, // ✅ skip OTP since it's verified by Google
      });
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

