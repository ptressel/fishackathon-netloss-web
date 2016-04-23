(function(angular) {
  "use strict";

  var app = angular.module('netloss.reportDetail', ['ngRoute', 'firebase.utils', 'firebase', 'colorpicker.module']);
  
  app.controller('ReportDetailCtrl', ['$scope', '$routeParams', 'fbutil', '$firebaseObject', "$location", "$firebaseArray",
    function($scope, $routeParams, fbutil, $firebaseObject, $location, $firebaseArray, geocoderService, $sce) {
      
      // Load the report
      var reportId = $routeParams.reportId;
      $scope.ref = fbutil.ref('Reports', reportId)
      $scope.report = $firebaseObject($scope.ref);
      $scope.report.$loaded().then(function () {
         // once the report object is loaded
      });

    }
  ]);

  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.whenAuthenticated('/reports/:reportId', {
        templateUrl: 'reports/report_detail.html',
        controller: 'ReportDetailCtrl'
      });
    }
  ]);

})(angular);
