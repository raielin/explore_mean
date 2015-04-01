var mongoose = require('mongoose');
// using pbkdf2() function to hash our passwords which ships with node's native crypto module
var crypto = require('crypto');
// using JWT to generate tokens for session management
var jwt = require('jsonwebtoken');

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
UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

// generateJWT() instance method for generating a JWT token for the user with jsonwebtoken() module
UserSchema.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);

  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  },
  'SECRET');
};

/* Note on jwt.sign() */
// first argument is payload that gets signed. both server and client have access to payload.
// second argument is the secret used to sign our tokens. it's hard-coded here in this example, but normally, ALWAYS use an environment variable for referencing the secret and keep it out of codebase.

mongoose.model('User', UserSchema);
