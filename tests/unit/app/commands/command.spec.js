'use strict';

var expect  = require('chai').expect;
var Request = require('../../../../src/app/request');
var Command = require('../../../../src/app/commands/command');

describe('Base Command', function() {

  describe('Built in Matching', function() {

    it('Works for regular strings', function() {
      var request = new Request('static route');
      var command = new Command('static route', function(request, done) { done(); });
      var result = command.match(request);
      expect(result).to.equal(true);
    });

    it('Parses input', function() {
      var request = new Request('set a b');
      var command = new Command('set <key> <value>', function(request, done) { done(); });
      var result = command.match(request);

      expect(result).to.equal(true);
      expect(request.get('key')).to.equal('a');
      expect(request.get('value')).to.equal('b');
    });

  });

});
