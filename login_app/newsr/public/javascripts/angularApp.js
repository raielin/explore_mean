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
      });

    // For any unmatched url, redirect to /home
    $urlRouterProvider.otherwise('home');
  }]);

/* SERVICE - Posts */
// posts service to allow us to access and inject the posts array outside of the main controller.
// inject $http service to query Posts route.
app.factory('postsFactory', ['$http',
  function($http) {
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

    o.upvote = function(post) {
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
      postsFactory.upvote(post);
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
      comment.upvotes += 1;
    }
  }
]);



