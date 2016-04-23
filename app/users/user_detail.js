(function(angular) {
  "use strict";

  var app = angular.module('netloss.userDetail', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('UserDetailCtrl', ['$scope', '$routeParams', 'fbutil', '$firebaseObject', "$firebaseArray",
    function($scope, $routeParams, fbutil, $firebaseObject, $firebaseArray) {
      
      $scope.createMode = false;
      
      var userId = $routeParams.userId;
      if (userId === "create") {
        $scope.createMode = true;
        $scope.ref = $firebaseArray(fbutil.ref('Users'));
        $scope.user = {};
      } else {
        $scope.ref = fbutil.ref('Users', userId);
        $scope.user = $firebaseObject($scope.ref);
      };
      
    }
  ]);

  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.whenAuthenticated('/users/:userId', {
        templateUrl: 'users/user_detail.html',
        controller: 'UserDetailCtrl'
      });
    }
  ]);

})(angular);
