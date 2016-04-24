(function (angular) {
  "use strict";

  var app = angular.module('netloss.reports', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('ReportsCtrl', ['$scope', 'reportsList', function($scope, reportsList) {
      $scope.reports = reportsList;

      var mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng(47.5234, -122.0097),
          mapTypeId: google.maps.MapTypeId.TERRAIN
      }
      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      //$scope.markers = [];
      var infoWindow = new google.maps.InfoWindow();
      var createMarker = function (report){
          var marker = new google.maps.Marker({
              map: $scope.map,
              position: new google.maps.LatLng(report.Latitude, report.Longitude),
              title: report.name
          });
          marker.content = '<div class="infoWindowContent">' + report.$id + '</div>';
          google.maps.event.addListener(report, 'click', function(){
              infoWindow.setContent('<h2>' + report.$id + '</h2>' + marker.content);
              infoWindow.open($scope.map, marker);
          });
          //$scope.markers.push(marker);
      }  

      var i;
      for (i = 0; i < reportsList.length; i++){
          createMarker(reportsList[i]);
      }

      $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
      }
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