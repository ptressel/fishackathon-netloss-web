'use strict';

// Declare app level module which depends on filters, and services
angular.module('netloss', [
    'netloss.config',
    'netloss.security',
    'netloss.home',
    'netloss.login',
    'netloss.root',
    'netloss.reports',
    'netloss.reportDetail',
    'netloss.users',
    'ui.bootstrap'
  ])
  
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  }]);
  
  