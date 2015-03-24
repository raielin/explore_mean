var app = angular.module('newsr', ['ui.router']);

// Configure ui-router using Angular config() function to setup a _home_ state.
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      });

    // route to individual post
    $stateProvider.state('posts', {
      // 'id' is a route parameter that will be made available to our controller
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });

    $urlRouterProvider.otherwise('home');
  }]);

// posts service to allow us to access and inject the posts array outside of the main controller.
app.factory('postsFactory', [
  function() {
    var o = {posts: []};
    return o;
    // o object is exposed to any other Angular module that injects it.
    // could have just exported posts array directly, but adding it to an object lets us add new objects and methods to the service in the future.
  }
]);

// Injections give controller access to $scope and postsFactory
app.controller('MainCtrl', ['$scope', 'postsFactory',
  function($scope, postsFactory){

    $scope.test = 'Welcome to Newsr!';

    // Any change or modification to $scope.posts is stored in the postsFactory service and immediately acessible by any other module that injects the postsFactory service.
    $scope.posts = postsFactory.posts;

    $scope.addPost = function() {
      // prevent user from submitting a new post with a blank title
      if(!$scope.title || $scope.title === '') {
        return;
      }

      // retrieve title from ng-model directive and push object to posts array
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Joe', body: 'Cool post!', upvotes: 0},
          {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      });

      // clear title and link value after adding new post.
      $scope.title = '';
      $scope.link = '';
    }

    // passing in the current instance of post from the view. this happens _by reference_ so upvotes are automatically reflected back to view.
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    }
  }
]);

// PostsCtrl - injecting $stateParams and postsFactory service. $stateParams is a ui-router object - provides controller with individual parts of the navigated URL. In this case, allows us to retrieve the post id from the URL and load the appropriate post.
// More on $stateParams: https://github.com/angular-ui/ui-router/wiki/URL-Routing
app.controller('PostsCtrl', ['$scope', '$stateParams', 'postsFactory',
  function($scope, $stateParams, postsFactory) {
    $scope.post = postsFactory.posts[$stateParams.id];

    $scope.addComment = function() {
      if($scope.body === '') {
        return;
      }

      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });

      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      comment.upvotes += 1;
    }
  }
]);



