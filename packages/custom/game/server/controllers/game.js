'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Game = mongoose.model('Game'),
  GameCharacter = mongoose.model('GameCharacter'),
  _ = require('lodash');


/**
 * Find game by id
 */
exports.game = function(req, res, next, id) {
  Game.load(id, function(err, game) {
    if (err) return next(err);
    if (!game) return next(new Error('Failed to load game ' + id));
    req.game = game;
    next();
  });
};

/**
 * Create an game
 */
exports.create = function(req, res) {
  var game = new Game(req.body);
  game.hostuser = req.user;
  game.state = 'pre';

  game.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the game: ' + err
      });
    }
    game.addCharacter(req.user, function(err) {
        if(err)
            return res.json(500, {error:'Cant add character'});
        return res.json(game);
    });
  });
};

/**
 * Update an game
 */
exports.update = function(req, res) {
  var game = req.game;
  // todo code for adding users and stuff

  if(req.body === '') {
      game.addCharacter(req.user, function(err) {
        if(err)
            return res.json(500, {error:'Cant add character'});
        return res.json(game);
      });
  }


  game = _.extend(game, req.body);

  game.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the game'
      });
    }
    res.json(game);

  });
};

/**
 * Delete an game
 */
exports.destroy = function(req, res) {
  var game = req.game;

  game.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the game'
      });
    }
    res.json(game);

  });
};

/**
 * Show an game
 */
exports.show = function(req, res) {
  res.json(req.game);
};

/**
 * List of Games
 */
exports.all = function(req, res) {
  Game.find().sort('-created').populate('hostuser', 'name username').exec(function(err, games) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the games'
      });
    }
    res.json(games);

  });
};
