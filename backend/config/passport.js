const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

// Debug info
console.log('Initializing Passport with Google Strategy');
console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user:', id);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google callback received:', {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });

      // Cari user berdasarkan email dari Google
      const userEmail = profile.emails[0].value;
      let user = await User.findOne({ email: userEmail });
      
      if (!user) {
        console.log('User not found with email:', userEmail);
        return done(null, false, { 
          message: 'Email tidak terdaftar. Silakan hubungi admin untuk registrasi.' 
        });
      }
      
      console.log('Found user:', user);

      // Update Google-specific fields
      user.googleId = profile.id;
      user.photo = profile.photos[0].value;
      
      // Jika user belum punya username, gunakan nama dari Google
      if (!user.username || user.username === user.email) {
        const baseUsername = profile.displayName.toLowerCase().replace(/\s+/g, '_');
        user.username = baseUsername;
      }
      
      await user.save();
      console.log('User updated successfully with username:', user.username);
      return done(null, user);
    } catch (error) {
      console.error('Error in Google Strategy:', error);
      return done(error, null);
    }
  }
));

module.exports = passport;