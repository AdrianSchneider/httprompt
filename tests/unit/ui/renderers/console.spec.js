'use strict';

var expect          = require('chai').expect;
var ConsoleRenderer = require('../../../../src/ui/renderers/console');

describe('Console Renderer', function() {

  beforeEach(function() {
    this.console = new MockLogger();
    this.renderer = new ConsoleRenderer(this.console, 2);
  });

  describe('#renderResponse', function() {

    var rendersAsExpected = function(response, expected, done) {
      this.renderer.renderResponse(response, function(err) {
        if(err) return done(err);
        expect(this.console.stdout).to.equal(expected);
        return done();
      }.bind(this));
    };

    it('Skips empty responses', function(done) {
      rendersAsExpected.bind(this)(null, '', done);
    });

    it('Prints strings literally rather than as JSON', function(done) {
      rendersAsExpected.bind(this)('hello world', 'hello world\n', done);
    });

    it('Prints the serialized object when a serialize method is available', function(done) {
      var response = { serialize: function() { return '[1, 2, 3, 4]'; } };
      rendersAsExpected.bind(this)(response, '[1, 2, 3, 4]\n', done);
    });

    it('Falls back to JSON stringifing', function(done) {
      var response = { name: "bob" };
      rendersAsExpected.bind(this)(response, JSON.stringify(response, null, 2) + '\n', done);
    });

  });

  describe('#renderError', function() {

    it('Prints the error', function(done) {
      var error = new Error('wat');
      this.renderer.renderError(error, function(err) {
        if(err) return done(err);
        expect(this.console.stdout).to.equal('Error: wat\n');
        return done();
      }.bind(this));
    });

  });

});

function MockLogger() {
  this.stdout = '';
  this.stderr = '';

  this.log = function(args) {
    this.stdout += [].slice.call(arguments).join(' ') + '\n';
  };

  this.error = function(args) {
    this.stderr += [].slice.call(arguments).join(' ') + '\n';
  };
}
