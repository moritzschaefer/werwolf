'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GameCharacterSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  _game: {type: Schema.Types.ObjectId, ref: 'Game'},
  character: String,
  alive: {type: Boolean, default: true}
});

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
  this.findOne({
    _id: id
  }).populate('hostuser participants').exec(cb);
};

mongoose.model('GameCharacter', GameCharacterSchema);
mongoose.model('Game', GameSchema);
