'use strict';

var expect      = require('chai').expect;
var nodemock    = require('nodemock');
var Request     = require('../../../../src/app/request');
var helpCommand = require('../../../../src/app/commands/help')()[0];

describe('Profile Commands', function() {

  beforeEach(function() {
    this.dispatcher = {
      getCommands: function() {
        return [
          { getHelp: function() { return 'cool'; } },
          { getHelp: function() { return 'beans'; } }
        ];
      }
    };
    helpCommand.setDispatcher(this.dispatcher);
  });

  describe('help', function() {

    it('returns a list of profiles', function(done) {
      helpCommand.process(new Request(''), function(err, output) {
        expect(output).to.deep.equal(['beans', 'cool']);
        done();
      });
    });

  });

});
