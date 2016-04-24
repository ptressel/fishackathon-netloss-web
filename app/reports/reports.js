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

        $scope.markers = [];
        var infoWindow = new google.maps.InfoWindow();
        // TODO If these icons are being fetched and loaded more than once, get local copies.
        var createMarker = function (report){
        	var icon = report.Type == "Found" ?
        			'http://maps.google.com/mapfiles/ms/icons/green-dot.png' :
        			'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(report.Latitude, report.Longitude),
                title: report.name,
                icon: icon
            });
            marker.content = '<div class="infoWindowContent">' + report.$id + '</div>';
            google.maps.event.addListener(report, 'click', function(){
                infoWindow.setContent('<h2>' + report.$id + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        }  

        // Function to create map markers
        var createMapMarkers = function() {
          $scope.markers = [];
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
        
        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
      });
    }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated('/reports', {
      templateUrl: 'reports/reports.html',
      controller: 'ReportsCtrl'
    });
  }]);

})(angular);