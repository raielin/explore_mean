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

####Additional Libraries
* [Mongoose.js](http://mongoosejs.com/) for adding structure to MongoDB.
* [Angular ui-router](https://github.com/angular-ui/ui-router) for client-side routing.
    * `ui-router` is newer and provides more flexibility and features than the more standard ngRoute module.
* [Twitter Bootstrap](http://getbootstrap.com/) for some quick styling.

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
* From `newsr` directory, run `$ npm start` in command line.
* Point browser to [http://localhost:3000](http://localhost:3000).
