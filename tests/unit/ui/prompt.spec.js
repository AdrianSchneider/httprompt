'use strict';

var expect       = require('chai').expect;
var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var nodemock     = require('nodemock');
var Prompt       = require('../../../src/ui/prompt');

describe('Prompt', function() {

  beforeEach(function() {
    var options = {};
    this.readline = { createInterface: function() { return new Interface(); }  };
    this.renderer = nodemock.mock();
    this.commands = [{
      match   : function(line) { return line === 'a'; },
      process : function(line, done) { done(null, 'processed a'); },
      getHelp : function() { return [ 'a: emits a' ]; }
    }, {
      match   : function(line) { return line.indexOf('a') === 0; },
      process : function(line, done) { done(null, 'processed aa'); },
      getHelp : function() { return [ 'aa: starts with a' ]; }
    }, {
      match   : function(line) { return line === 'b' ; },
      process : function(line, done) { done(null, 'processed b'); },
      getHelp : function() { return ['b: emits b']; }
    }];
    this.prompt = new Prompt(this.readline, this.commands, this.renderer, options);
  });

  afterEach(function() {
    this.renderer.assertThrows();
  });

  it('Skips and resumes on ""', function(done) {
    var rl = this.prompt.start();
    rl.on('prompt', done);
    rl.emit('line', '');
  });

  it('Prints out help sorted for all providers on "help"', function(done) {
    this.renderer
      .mock('render')
      .takesF(function(renderer, msg, done) {
        expect(msg).to.deep.equal(['a: emits a', 'aa: starts with a', 'b: emits b']);
        return true;
      })
      .calls(2, []);

    var rl = this.prompt.start();
    rl.on('prompt', done);
    rl.emit('line', 'help');
  });

  it('Errors on unknown command', function(done) {
    this.renderer
      .mock('render')
      .takesF(function(renderer, msg, done) {
        expect(msg.message).to.contain('Unknown');
        return true;
      })
      .calls(2, []);

    var rl = this.prompt.start();
    rl.on('prompt', done);
    rl.emit('line', 'invalid command');
  });

  it('Runs first matched provider and resumes after rendering', function(done) {
    this.renderer
      .mock('render')
      .takesF(function(renderer, response, done) {
        expect(response).to.equal('processed a');
        return true;
      })
      .calls(2, []);

    var rl = this.prompt.start();
    rl.on('prompt', done);
    rl.emit('line', 'a');
  });

});

/**
 * Stub readline.Interface
 * Mocking this with streams got very messy
 */
function Interface() {
  EventEmitter.call(this);
  this.setPrompt = function() {};
  this.prompt = function() { this.emit('prompt'); };
  this.pause = function() { this.emit('pause'); };
}

util.inherits(Interface, EventEmitter);
