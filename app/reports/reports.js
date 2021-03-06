(function (angular) {
  "use strict";

  var app = angular.module('netloss.reports', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('ReportsCtrl', ['$scope', 'fbutil', '$firebaseArray', function($scope, fbutil, $firebaseArray) {
      
      // Load the Reports ref directly in here
      var $netlossArray = $firebaseArray.$extend({    
          // This is called anytime a new object is added   
          $$added: function(dataSnapshot){
              var user = dataSnapshot.val(); //This is the data
              
              return user; 
          },
          $$updated: function(dataSnapshot){
             //An update has been made
             var changed = false; 
             //Go through your data, if changed change the variable. 
             return changed;
          }
      });
    
      var ref = fbutil.ref('Reports');
      var reportsList = $firebaseArray(ref);
      // $loaded gets called whenever all items are actually loaded
      reportsList.$loaded(function() {
        
        // Expose "reports" to the template
        $scope.reports = reportsList;
      
        var mapOptions = {
            zoom: 9,
            center: new google.maps.LatLng(48.341690, -122.880927),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        // TODO If these icons are being fetched and loaded more than once, get local copies.
        var createMarker = function (report){
        	var icon = report.Type == 'Found' ?
        			'http://maps.google.com/mapfiles/ms/icons/green-dot.png' :
        			'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(report.Latitude, report.Longitude),
                title: 'Net',
                icon: icon
            });
            var type = report.Type == 'Found' ? 'Found' : 'Lost';
            var infoText = 'Net: ' + type
            var infoOffset = new google.maps.Size(0, -10)
            var infoWindow = new google.maps.InfoWindow({
            	position: new google.maps.LatLng(report.Latitude, report.Longitude),
                pixelOffset: infoOffset,
            	content: infoText
            });
            marker.addListener('click', function() {
                infoWindow.open($scope.map);
            });
        }  

        // Function to create map markers
        var createMapMarkers = function() {
          var i;      
          for (i = 0; i < reportsList.length; i++){
              createMarker(reportsList[i]);
          }
        }
      
        // Call it for initial load
        createMapMarkers();
        
        // $watch is called when the data model changes, for us to 
        // reload the map pins
        $scope.reports.$watch(function (data) {
          // TODO we may need to wipe the old map markers?
          createMapMarkers();
        });
      });
    }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated('/reports', {
      templateUrl: 'reports/reports.html',
      controller: 'ReportsCtrl'
    });
  }]);

})(angular);