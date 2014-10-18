'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),

  Schema = mongoose.Schema;

var characters = 'werewolf citizen witch girl hunter god cupid seer'.split(' ');
var GameCharacterSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  _game: {type: Schema.Types.ObjectId, ref: 'Game'},
  character: {
      type: String,
      required: true,
      enum: characters
  },
  alive: {
      type: Boolean,
        default: true
    }

});

/**
 * Statics
 */
GameCharacterSchema.statics.findByUser = function(user, cb) {
    this.findOne({
            user: user
    }, cb);
};

/**
 * Game Schema
 */
var gameStates = 'pre day night finished'.split(' ');
var GameSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  state: { // The game state
    type: String,
    default: 'pre',
    required: true,
    enum: gameStates
  },
  hostuser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  participants : [{ type: Schema.Types.ObjectId, ref: 'GameCharacter' }]
});

/**
 * Validations
 */
GameSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

/**
 * Statics
 */
GameSchema.statics.load = function(id, cb) {
    var User = mongoose.model('User');
  this.findOne({
    _id: id
  }).populate('hostuser participants').exec(function(err,data) {
    var options = {
      path: 'participants.user',
      model: 'User'
    };

    if (err) return null;
    User.populate(data, options, cb);
  });
};

/**
 * methods
 */

GameSchema.methods.addCharacter = function(user, cb) {
    // create new participant and add

    var GameCharacter = mongoose.model('GameCharacter');
    var character = new GameCharacter({user: user, _game: this._id});

    character.save(function(err) {
        if(err) {
            return cb(err);
        }
        this.participants.push(character);
        this.save(function(err) {
            if(err) {
                return cb(err);
            }
            cb(null);
        });
    });
};

GameSchema.methods.detailsForUser = function(user, cb) {
    // find character first
};
GameSchema.methods.detailsForCharacter = function(user, cb) {
    // find character first
};

mongoose.model('GameCharacter', GameCharacterSchema);
mongoose.model('Game', GameSchema);
