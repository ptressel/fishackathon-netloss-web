'use strict';

/* Directives */


angular.module('netloss')

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm) {
      elm.text(version);
    };
  }]);
