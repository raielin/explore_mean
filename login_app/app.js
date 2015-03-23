var app = angular.module('newser', []);

app.controller('MainCtrl', ['$scope',
  function($scope){

    $scope.test = 'Welcome to Newser!';

    $scope.posts = [
      {title: 'post 1', upvotes: 5},
      {title: 'post 2', upvotes: 2},
      {title: 'post 3', upvotes: 15},
      {title: 'post 4', upvotes: 9},
      {title: 'post 5', upvotes: 4}
    ];

    $scope.addPost = function() {
      // prevent user from submitting a new post with a blank title
      if(!$scope.title || $scope.title === '') {
        return;
      }

      // retrieve title from ng-model directive and push object to posts array
      $scope.posts.push({title: $scope.title, upvotes: 0});

      // clear $scope.title value after adding new post.
      $scope.title = '';
    }

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    }
  }
])
