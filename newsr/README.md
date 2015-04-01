##Intro to MEAN & Login Auth (via Passport)

###Tutorial from Thinkster.io
https://thinkster.io/mean-stack-tutorial/

####Project Specs
* Create new posts
* View all posts ordered by upvotes
* Add comments about a given post
* View comments for a given post
* Upvote posts and comments
* Create and authenticate users

####Additional Libraries/Tools
* [Mongoose.js](http://mongoosejs.com/) for adding structure to MongoDB.
* [Angular ui-router](https://github.com/angular-ui/ui-router) for client-side routing.
    - `ui-router` is newer and provides more flexibility and features than the more standard ngRoute module.
* [Twitter Bootstrap](http://getbootstrap.com/) for some quick styling.
* [Passport](http://passportjs.org/) for user authentication with JWT tokens for session management.
* [Express-Generator](http://expressjs.com/starter/generator.html) to quickly create an application skeleton. (Also see [Github repo](https://github.com/expressjs/generator).) Default app directory structure:
```
    .
    ├── app.js
    ├── bin
    │   └── www
    ├── package.json
    ├── public
    │   ├── images
    │   ├── javascripts
    │   └── stylesheets
    │       └── style.css
    ├── routes
    │   ├── index.js
    │   └── users.js
    └── views
        ├── error.jade
        ├── index.jade
        └── layout.jade
```
    
####Routes
```
GET:  /posts - return a list of posts and associated metadata
POST: /posts - create a new post
GET:  /posts/:id - return an individual post with associated comments
PUT:  /posts/:id/upvote - upvote a post, notice we use the post ID in the URL
POST: /posts/:id/comments - add a new comment to a post by ID
PUT:  /posts/:id/comments/:id/upvote - upvote a comment
```

####To Run App
* Run a MongoDB server: `$ mongod &`
* From `newsr` directory, run `$ npm start` in command line.
* Point browser to [http://localhost:3000](http://localhost:3000).

####Test App with CURL
To create a post:
```
$ curl --data 'title=test&link=http://test.com' http://localhost:3000/posts
  => This should return the created post object in JSON
```

To upvote a post:
```
$ curl -X PUT http://localhost:3000/posts/<POST ID>/upvote
  => This should return the post object with the "upvote" property incremented.
```

####TODO
* Break out templates and Angular modules appropriately, according to standard MEAN app directory structure.
* Add testing.
* Better design.
* Allow user to delete their own posts.
* Allow user to view all of their own posted content.
* Add SuperUser permissions.
* Implement search functionality with [Browserify](http://blog.npmjs.org/post/114584444410/using-angulars-new-improved-browserify-support).
* Implement filtering functionality of posts.
* Provide dates for posts.
* Add oauth login options via [Passport](http://passportjs.org/guide/providers/).
