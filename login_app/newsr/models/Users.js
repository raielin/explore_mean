var mongoose = require('mongoose');

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

mongoose.model('User', UserSchema);
