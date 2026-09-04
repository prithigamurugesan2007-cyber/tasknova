// passportConfig.js - Google & Facebook OAuth strategies.
// Strategies only activate if the matching keys exist in your .env file.
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('./db');

function findOrCreateOAuthUser({ email, name, avatar, provider }) {
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    const info = db.prepare(
      'INSERT INTO users (name, email, password, provider, avatar) VALUES (?, ?, NULL, ?, ?)'
    ).run(name, email.toLowerCase(), provider, avatar);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  }
  return user;
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const user = findOrCreateOAuthUser({
        email,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'google'
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
      const user = findOrCreateOAuthUser({
        email,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'facebook'
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

module.exports = passport;
