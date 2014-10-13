'use strict';

angular.module('mean.game').controller('GameController', ['$scope', '$location', '$stateParams', 'Global', 'Game',
  function($scope, $location, $stateParams, Global, Game) {
    $scope.global = Global;
    $scope.package = {
      name: 'game'
    };
    $scope.hasAuthorization = function(game) {
      if (!game || !game.hostuser) return false;
      return $scope.global.isAdmin || game.hostuser._id === $scope.global.user._id;
    };
    $scope.remove = function(game) {
      if (game) {
        game.$remove();

        for (var i in $scope.games) {
          if ($scope.games[i] === game) {
            $scope.games.splice(i, 1);
          }
        }
      } else {
        $scope.game.$remove(function(response) {
          $location.path('games');
        });
      }
    };
    $scope.create = function(isValid) {
      if (isValid) {
        var game = new Game({
          title: this.title,
        });
        game.$save(function(response) {
          $location.path('games/' + response._id);
        });

        this.title = '';
      } else {
        $scope.submitted = true;
      }
    };
    $scope.find = function() {
      Game.query(function(games) {
        $scope.games = games;
      });
    };
    $scope.findOne = function() {
      Game.get({gameId:$stateParams.gameId}, function(game) {
        $scope.game = game;
      });
    };
  }
]);

