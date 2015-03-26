var app = angular.module('newsr', ['ui.router']);

/* CONFIG */
// Configure ui-router using Angular config() function to setup a _home_ state.
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        // Use resolve property of ui-router to automatically query all posts from backend before `home` state finishes loading
        resolve: {
          // // A string value resolves to a service.
          // postsFactory: 'postsFactory',
          // // A function value resolves to the return value of the function.
          // loadPosts: function(postsFactory) {
          //   return postsFactory.getAll();
          // }

          // Can also be condensed into the following, where postsFactory is assigned to the argument of the function.
          loadPosts: ['postsFactory', function(p) {
            return p.getAll();
          }]
        },
        controller: 'MainCtrl'
      })
      // route to individual post
      .state('posts', {
        // 'id' is a route parameter that will be made available to our controller
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        // ui-router detects `posts` state and will automatically query the server for the full post object, including comments before the state finishes loading.
        resolve: {
          grabPost: ['$stateParams', 'postsFactory', function($stateParams, p) {
            return p.getPost($stateParams.id);
          }]
        },
        controller: 'PostsCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        // onEnter() will check user authentication prior to entering the state and send them back to home if they're already logged in.
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      });
    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise('home');
  }
]);

/* FACTORY auth */
// use $window for interfacing with `localStorage`.
app.factory('authFactory', ['$http', '$window',
  function($http, $window) {
    var auth = {};

    auth.saveToken = function(token) {
      $window.localStorage['newr-token'] = token;
    };

    auth.getToken = function() {
      return $window.localStorage['newsr-token'];
    };

    // if token exists, check payload for expiration. if not, then assume user is logged out.
    // payload is JSON object in middle part of token between two `.`s. $window.atob() turns payload back to a stringified JSON. `JSON.parse` turns it back to a javascript object.
    auth.isLoggedIn = function() {
      var token = auth.getToken();

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    // Retreive username of current user
    auth.currentUser = function() {
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
      }
    };

    // Register user by POSTing user to /register route and saving returned token
    auth.register = function(user) {
      return $http.post('/register', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };

    // Login user by POSTing user to /login route and saving returned token
    auth.logIn = function(user) {
      return $http.post('/login', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };

    // Logout user by removing token from localStorage
    auth.logOut = function() {
      $window.localStorage.removeItem('newsr-token');
    };

    return auth;
  }
]);

  /* SERVICE post */
  // posts service to allow us to access and inject the posts array outside of the main controller.
  // inject $http service to query Posts route.
app.factory('postsFactory', ['$http', 'authFactory',
  function($http, authFactory) {
    var o = {posts: []};

    // Load all posts.
    // angular.copy() method creates a deep copy of the returned data. ensures $scope.posts variable in MainCtrl will also be updated, so new values are reflected in our view.
    o.getAll = function() {
      // success() function allows us to bind a function to be executed when the request returns.
      // in this case, we use angular.copy() to copy the list of posts returned by our route so it can be injected in our controllers and copied to the client side posts object.
      return $http.get('/posts').success(function(data) {
        angular.copy(data, o.posts);
      });
    };
    // Create new post.
    o.createPost = function(post) {
      return $http.post('/posts/', post).success(function(data) {
        o.posts.push(data);
      });
    };

    o.upvotePost = function(post) {
      return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
        post.upvotes += 1;
      });
    };

    // more on promises and then() method: https://docs.angularjs.org/api/ng/service/$q
    o.getPost = function(id) {
      return $http.get('/posts/' + id).then(function(res) {
        return res.data;
      });
    };

    o.createComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    }

    o.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
        .success(function(data) {
          comment.upvotes += 1;
        });
    };

    return o;
    // o object is exposed to any other Angular module that injects it.
    // could have just exported posts array directly, but adding it to an object lets us add new objects and methods to the service in the future.
  }
]);

/* CONTROLLER - Main */
// Injections give controller access to $scope and postsFactory
app.controller('MainCtrl', ['$scope', 'postsFactory',
  function($scope, postsFactory){

    // Any change or modification to $scope.posts is stored in the postsFactory service and immediately acessible by any other module that injects the postsFactory service.
    $scope.posts = postsFactory.posts;

    $scope.addPost = function() {
      // prevent user from submitting a new post with a blank title
      if(!$scope.title || $scope.title === '') {
        return;
      }

      // use createPost() function injected from posts service to add new posts.
      postsFactory.createPost({
        title: $scope.title,
        link: $scope.link
      });

      // clear title and link value after adding new post.
      $scope.title = '';
      $scope.link = '';
    }

    // passing in the current instance of post from the view. this happens _by reference_ so upvotes are automatically reflected back to view.
    $scope.incrementUpvotes = function(post) {
      postsFactory.upvotePost(post);
    }
  }
]);

/* CONTROLLER - Posts */
// injecting $stateParams and postsFactory service. $stateParams is a ui-router object - provides controller with individual parts of the navigated URL. In this case, allows us to retrieve the post id from the URL and load the appropriate post.
// More on $stateParams: https://github.com/angular-ui/ui-router/wiki/URL-Routing
// app.controller('PostsCtrl', ['$scope', '$stateParams', 'postsFactory',
//   function($scope, $stateParams, postsFactory) {
//     $scope.post = postsFactory.posts[$stateParams.id];

// After adding resolve object to posts state, we can modify PostsCtrl to:
app.controller('PostsCtrl', ['$scope', 'postsFactory', 'grabPost',
  function($scope, postsFactory, grabPost) {
    $scope.post = grabPost;

    $scope.addComment = function() {
      if($scope.body === '') {
        return;
      }

      // not sure why using grabPost._id instead of $scope.post for `id` argument - both work.
      postsFactory.createComment(grabPost._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });

      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      postsFactory.upvoteComment(grabPost, comment);
    };
  }
]);

/* CONTROLLER - Authentication */
// Initialize user on $scope for our form. Then create register() and logIn() methods on $scope to call respective auth factory methods. If no errors, send user back to home state using a promise.
app.controller('AuthCtrl', ['$scope', '$state', 'auth',
  function($scope, $state, auth) {
    $scope.user = {};

    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };

    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };
  }
]);

/* CONTROLLER - Navigation */
// Controller exposes isLoggedIn(), currentUser(), and logOut() methods from auth factory.
app.controller('NavCtrl', ['$scope', 'auth',
  function($scope,auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }
]);
