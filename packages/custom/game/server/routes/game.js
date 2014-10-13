'use strict';

var game = require('../controllers/game.js');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.game.hostuser.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

// The Package is past automatically as first parameter
module.exports = function(Game, app, auth, database) {
  app.route('/games')
    .get(game.all)
    .post(auth.requiresLogin, game.create);
  app.route('/games/:gameId')
    .get(game.show)
    .put(auth.requiresLogin, hasAuthorization, game.update)
    .delete(auth.requiresLogin, hasAuthorization, game.destroy);

  // Finish with setting up the gameId param
  app.param('gameId', game.game);
};
