var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// In Express, `req` stands for "request"; `res` stands for "response".
// `req` contains all information about the request made to the server, including data fields.
// `res` is the object used to respond to the client

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET posts */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if(err) {
      return next(err);
    }

    res.json(posts);
  });
});

/* POST posts */
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err) {
      return next(err);
    }

    res.json(post);
  });
});

module.exports = router;
