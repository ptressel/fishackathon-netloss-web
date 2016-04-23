(function(angular) {
  "use strict";

  var app = angular.module('netloss.root', [ 'ngAnimate', 'firebase.utils' ]);
  app.directive('integer', function(){
      return {
          require: 'ngModel',
          link: function(scope, ele, attr, ctrl){
              ctrl.$parsers.unshift(function(viewValue){
                  return parseInt(viewValue, 10);
              });
          }
      };
  });
  
  app.controller('RootCtrl', ['$scope', 'Auth', 'fbutil', '$firebaseObject', '$timeout', '$location', '$routeParams',
    function($scope, Auth, fbutil, $firebaseObject, $timeout, $location, $routeParams) {
      
      Auth.$onAuth(function(authData) {
        if (authData) {
          $scope.loggedIn = !!authData;
        }
      });
      
      $scope.logout = function() {
        $scope.loggedIn = false;
        $scope.user.$destroy();
        Auth.$unauth();
        $location.path('/login');
      };
          
      $scope.showSuccessAlert = false;

      // Delete the object
      $scope.deleteObject = function(object, ref) {
                
        object.$remove().then(function (ref) {
          // Redirect back to the list
          var path = $location.path();
          var newPath = path.substr(0, path.lastIndexOf('/'));
          $location.path(newPath);
          $scope.displaySuccess("The entry has been deleted.");
        }, function (error) {
          $scope.displayError("Could not delete this entry.");
        });
      }
      
      $scope.goBackOneLevel = function() {
        var path = $location.path();
        var lastPathIndex = path.lastIndexOf('/');
        var newPath = path.substr(0, lastPathIndex);
        $location.path(newPath);
      };
      
      // Sync all data back to our database
      $scope.saveControllerState = function(object, ref) {

        if(object.$id === undefined) {   
          // Add the object to Firebase
          ref.$add(object).then(function(ref) {
            // Redirect the user to the new object
            var path = $location.path();
            var currentID = path.substr(path.lastIndexOf('/') + 1)
            var newPath = path.replace(currentID, ref.key());
            $location.path(newPath);
            $scope.displaySuccess("This entry has been created.");
          }, function(error) {
            $scope.displayError("Could not create this entry.");
          });
        } else {
          // Save the object to Firebase
          object.$save().then(function(ref) {
            $scope.displaySuccess("This entry has been saved.");
          }, function(error) {
            $scope.displayError("Could not save this entry.");
          });
        }
      };

      // Show a success message
      $scope.displaySuccess = function(msg) {
        $scope.successTextAlert = msg;
        $scope.showSuccessAlert = true;
        $timeout(function() {
          $scope.showSuccessAlert = false;
        }, 2000);
      }
      
      // Show an error message
      $scope.displayError = function(msg) {
        $scope.errorTextAlert = msg;
        $scope.showErrorAlert = true;
        $timeout(function() {
          $scope.showErrorAlert = false;
        }, 2000);
      }
    }
  ]);

})(angular);

// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}

