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
    if (err) {
      return next(err);
    }

    res.json(posts);
  });
});

/* POST posts */
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if (err) {
      return next(err);
    }

    res.json(post);
  });
});

/* Grab Post object by ID */
// Use Express's param() function to automatically preload post object.
// Use Mongoose's query interface which provides a more flexible way of interacting with the database.
// Any route URL with :post in it will run this function first to retrieve the post object from the datase, then attach it to the `req` object of the route handler function.
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return next(new Error('can\'t find post'));
    }
    req.post = post;
    return next();
  });
});

/* Grab Comment object by ID */
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if (err) {
      return next(err);
    }

    if (!comment) {
      return next(new Error('can\'t find comment'));
    }

    req.comment = comment;
    return next();
  });
});

/* GET post */
// Will grab post ID as written in router.param and attach it to the `req` argument passed into route handler function.
router.get('/posts/:post', function(req, res) {
  // `req` already has the post ID attached to it when this runs.
  res.json(req.post);
});

/* PUT post upvotes */
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) {
      return next(err);
    }

    res.json(post);
  });
});

/* POST comment */
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);

  comment.save(function(err, comment) {
    if (err) {
      return next(err);
    }

    req.post.comments.push(comment);

    req.post.save(function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(comment);
    });
  });
});

module.exports = router;

