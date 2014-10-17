'use strict';

angular.module('mean.game').config(['$stateProvider',
  function($stateProvider) {
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    $stateProvider.state('games', {
      url: '/games',
      templateUrl: 'game/views/index.html'
    })
    .state('create game', {
      url: '/games/create',
      templateUrl: 'game/views/create.html',
      resolve: {
        loggedin: checkLoggedin
      }
    })
    .state('game by id', {
      url: '/games/:gameId',
      templateUrl: 'game/views/view.html',
      resolve: {
        loggedin: checkLoggedin
      }
    });
  }
]);
