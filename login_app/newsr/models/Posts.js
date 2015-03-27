var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  author: String,
  upvotes: {
    type: Number,
    default: 0
  },
  // ObjectId datatype refers to a MongodB ObjectId stored in the database. Mongoose will retreive the object 'Comment' object referenced by the ID.
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);
