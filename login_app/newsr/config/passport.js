var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Create new LocalStrategy with logic on how to authenticate a user with a given username and password.
// Calls validPassword() function from UserSchema in Users model.
// For more on passport configuration: http://passportjs.org/guide/configure/

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({
    username: username
  },
  function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Incorrect password.'
      });
    }
    return done(null, user);
  });
}));
