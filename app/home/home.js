(function(angular) {
  "use strict";

  var app = angular.module('netloss.home', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute']);
  app.config( [
      '$compileProvider',
      function( $compileProvider )
      {   
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob|mailto|tel):/);
      }
  ]);
  
  app.controller('HomeCtrl', ['$scope', 'fbutil', 'user', 'Auth', '$firebaseObject', '$firebaseArray', 'FBURL', function ($scope, fbutil, user, Auth, $firebaseObject, $firebaseArray, FBURL) {
    $scope.syncedValue = $firebaseObject(fbutil.ref('syncedValue'));
    $scope.user = user;
    $scope.FBURL = FBURL;
    
    $scope.userCount = 0;
    var emails = [];
    
    var usersRef = fbutil.ref('users');
    var users = $firebaseArray(usersRef);
    users.$loaded().then(function () {
      $scope.userCount = users.length;
      angular.forEach(users, function(user) {
        if(user.email && user.email.length > 0) {
          emails.push(user.email + "," + user.displayName + "," + user.firstName);
        }
      });
    });
    
  }]);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl',
      resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of accessing data or displaying elements)
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }]);

})(angular);

