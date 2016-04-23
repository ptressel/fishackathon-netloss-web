(function (angular) {
  "use strict";

  var app = angular.module('netloss.reports', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('ReportsCtrl', ['$scope', 'reportsList', function($scope, reportsList) {
      $scope.reports = reportsList;
    }]);

    app.factory('reportsList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var ref = fbutil.ref('Reports');
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated('/reports', {
      templateUrl: 'reports/reports.html',
      controller: 'ReportsCtrl'
    });
  }]);

})(angular);