var app = angular.module('newsr', []);

app.controller('MainCtrl', ['$scope',
  function($scope){

    $scope.test = 'welcome to newsr!';

    $scope.posts = [
      {title: 'post 1', link: '', upvotes: 5},
      {title: 'post 2', link: '', upvotes: 2},
      {title: 'post 3', link: '', upvotes: 15},
      {title: 'post 4', link: '', upvotes: 9},
      {title: 'post 5', link: '', upvotes: 4}
    ];

    $scope.addPost = function() {
      // prevent user from submitting a new post with a blank title
      if(!$scope.title || $scope.title === '') {
        return;
      }

      // retrieve title from ng-model directive and push object to posts array
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0
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
])
