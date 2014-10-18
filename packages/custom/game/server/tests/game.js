'use strict';

/** create user. create gamecharacter. test statics/methods. create a game. missing stuff. check st */
/** check statics!!!!! */
/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Game = mongoose.model('Game'),
 GameCharacter = mongoose.model('GameCharacter');

 /**
  * Globals
  **/
  var user;
  var gameCharacter;
  var game;

  /**
   * Test Suites
   */
   describe('<Unit Test>', function() {
     describe('Model GameCharacter:', function() {
       beforeEach(function(done) {
         user = new User({
             name: 'Full name',
             email: 'test@test.com',
             username: 'user',
             password: 'password'
         });

         user.save(function() {
           gameCharacter = new GameCharacter({
               character: 'citizen',
               user: user
           });
           done();
         });
       });

       describe('Method Save', function() {
         it('should be able to save without problems', function(done) {
           return gameCharacter.save(function(err) {
             should.not.exist(err);
             gameCharacter.character.should.equal('citizen');
             should.not.exist(gameCharacter._game);
             gameCharacter.alive.should.equal(true);
             done();
           });
         });
         it('shouldn\'t be able to save an invalid character', function(done) {
           gameCharacter.character = 'uiae'; // uiae is an invalid character
           return gameCharacter.save(function(err) {
             should.exist(err);
             done();
           });
         });

       });
       describe('Statics', function() {
         it('should be possible to find a character by user', function(done) {
           gameCharacter.save(function(err) {
             // save is checked before..
             return GameCharacter.findByUser(user, function(err, character) {
                should.not.exist(err);
                character._id.toString().should.equal(gameCharacter._id.toString());
                done();
             });

           });
         });
       });


       afterEach(function(done) {
         gameCharacter.remove();
         user.remove();
         done();
       });
     });
     describe('Model Game', function() {
       beforeEach(function(done) {
         user = new User({
             name: 'Full name',
             email: 'test@test.com',
             username: 'user',
             password: 'password'
         });

         user.save(function() {
           gameCharacter = new GameCharacter({
               character: 'citizen',
               user: user
           });
           gameCharacter.save();
           // now create game
           game = new Game({
               title: 'game title',
               hostuser: user
           });
           done();
         });
       });
       describe('Method Save', function() {
         it('should be able to save without problems', function(done) {
           return game.save(function(err) {
             should.not.exist(err);
             game.title.should.equal('game title');
             game.state.should.equal('pre');
             done();
           });
         });
       });
     });
   });

