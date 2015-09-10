'use strict';

var expect       = require('chai').expect;
var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var nodemock     = require('nodemock');
var Prompt       = require('../../../src/ui/prompt');
var Request      = require('../../../src/app/request');

describe('Prompt', function() {

  beforeEach(function() {
    this.readline = { createInterface: function() { return new Interface(); }  };
    this.renderer = nodemock.mock();
    this.dispatcher = nodemock.mock();
    this.prompt = new Prompt(this.readline, this.dispatcher, this.renderer, {});
  });

  afterEach(function() {
    this.renderer.assertThrows();
    if (this.dispatcher.assertThrows) this.dispatcher.assertThrows();
  });

  it('Skips and resumes on ""', function(done) {
    var rl = this.prompt.start();
    rl.on('prompt', done);
    rl.emit('line', '');
  });

  it('Prints an error when no commands match', function(done) {
    var request = new Request('made up');

    this.dispatcher
      .mock('dispatch')
      .takesF(function(request, f) {
        expect(request.getLine()).to.equal('made up');
        return true;
      })
      .calls(1, [null, false]);

    this.renderer
      .mock('render')
      .takesF(function(renderer, msg, done) {
        expect(msg.message).to.contain('Unknown');
        return true;
      })
      .calls(2, []);

    var rl = this.prompt.start();
    rl.on('prompt', done);
    rl.emit('line', 'made up');
  });

  it('Runs first matched provider and resumes after rendering', function(done) {
    this.dispatcher
      .mock('dispatch')
      .takesF(function(request, f) {
        expect(request.getLine()).to.equal('a');
        return true;
      })
      .calls(1, [null, true, 'processed a']);

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

  it('Queues requests so only one happens at a time', function(done) {
    var number = 0;

    this.readline = { createInterface: function() { return new Interface(); }  };
    this.renderer = nodemock.mock();
    this.dispatcher = {
      dispatch: function(req, cb) {
        setTimeout(function() { cb(null, true, ++number); }, 7); 
      }
    };
    this.prompt = new Prompt(this.readline, this.dispatcher, this.renderer, {});

    this.renderer.mock('render').takes('console', 1, function(){}).calls(2, []);
    this.renderer.mock('render').takes('console', 2, function(){}).calls(2, []);

    var rl = this.prompt.start();
    rl.on('prompt', function() {
      expect(number).to.equal(2);
      done();
    });
    rl.emit('line', 'a');
    rl.emit('line', 'a');
  });

  it('Preserves cursor when draining');

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
