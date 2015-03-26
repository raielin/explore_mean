var mongoose = require('mongoose');
// using pbkdf2() function to hash our passwords which ships with node's native crypto module
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  // store password hash
  hash: String,
  // generate and save salt whenever password is set
  salt: String
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

// Make sure the iterations and key length in setPassword() method match ones in validPassword()
// validPassword accepts a password and compares it to the stored hash, returning a boolean
UserSchema.methods.validPassword() = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

mongoose.model('User', UserSchema);
