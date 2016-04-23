'use strict';

/* Filters */

angular.module('netloss')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
