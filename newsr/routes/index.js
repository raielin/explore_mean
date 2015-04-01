var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

// In Express, `req` stands for "request"; `res` stands for "response".
// `req` contains all information about the request made to the server, including data fields.
// `res` is the object used to respond to the client

/* Middleware for authenticating jwt tokens in routes/index.js */
// Use `auth` in specific routes to require authentication.
// userProperty option specifies which property on `req` to put payload from tokens. Default is `user` but using `payload` here to avoid conflicts with passport (which shouldn't really be an issue since we aren't using both methods of authentication in the same request). Also to avoid confusion since payload isn't an instance of User model.
var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

/* NOTE on tokens: Make sure to use same secret as in User model for generating tokens. For the purposes of this practice app we are hard-coding the token, but otherwise, ALWAYS use an environment variable for referencing secret. */

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
router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

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

/* GET post */
// Will grab post ID as written in router.param and attach it to the `req` argument passed into route handler function.
router.get('/posts/:post', function(req, res) {
  // `req` already has the post ID attached to it when this runs.
  // populate() method will automatically load all comments associated with a particular post
  req.post.populate('comments', function(err, post) {
    if (err) {
      return next(err);
    }
    res.json(post)

  });
});

/* PUT post upvotes */
router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) {
      return next(err);
    }

    res.json(post);
  });
});

/* GET comments */
router.get('/posts/:post/comments', function(req, res, next) {
  Comment.find(function(err, comments) {
    if (err) {
      return next(err);
    }

    res.json(comments);
  });
});

/* POST comments */
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

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

/* GET comment */
router.get('/posts/:post/comments/:comment', function(req, res) {
  // `req` already has the post ID attached to it when this runs.
  res.json(req.comment);
});

/* PUT comment upvotes */
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if (err) {
      return next(err);
    }

    res.json(comment);
  });
});

/* POST register user */
// Creates user given a username and password
router.post('/register', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields.'
    });
  }

  var user = new User();
  // assign username
  user.username = req.body.username;

  // use setPassword() method from users model
  user.setPassword(req.body.password)
  user.save(function(err) {
    if (err) {
      return next(err);
    }
    return res.json({
      // generate token with generateJWT() method from users model
      token: user.generateJWT()
    });
  });
});

/* POST login user */
// Authenticates user and returns a token to the client
router.post('/login', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields.'
    });
  }
  // passport.authenticate('local') middleware uses LocalStrategy created in config/passport.js.
  // custom callback function for `authenticate` middleware allows us to return error messages to the client if auth fails. if auth successful, JWT token is returned to the client just - same as register route.
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({
        token: user.generateJWT()
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
