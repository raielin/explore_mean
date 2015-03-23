var app = angular.module('newser', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello world!';
  }
])
