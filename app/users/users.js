(function (angular) {
  "use strict";

  var app = angular.module('netloss.users', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('UsersCtrl', ['$scope', 'usersList', function($scope, usersList) {
      $scope.users = usersList;
      $scope.addUser = function(newUser) {
        if( newUser ) {
          $scope.users.$add({text: newUsers});
        }
      };
    }]);

  app.factory('usersList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray)  {
    var ref = fbutil.ref('Users');
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated('/users', {
      templateUrl: 'users/users.html',
      controller: 'UsersCtrl'
    });
  }]);

})(angular);