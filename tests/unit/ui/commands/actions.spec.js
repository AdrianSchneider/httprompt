'use strict';

var expect               = require('chai').expect;
var nodemock             = require('nodemock');
var Session              = require('../../../../src/session/session');
var ConfigProfile        = require('../../../../src/config/profile');
var CustomActionCommands = require('../../../../src/ui/commands/actions');

describe('Custom Action Commands', function() {

  beforeEach(function() {
    this.dispatcher = nodemock.mock();
    this.profile = new ConfigProfile('', {
      login: ['help']
    });
    this.session = {
      getProfile: function() { return this.profile ;}.bind(this),
      on: function() {}
    };
    this.command = new CustomActionCommands(this.session);
    this.command.setDispatcher(this.dispatcher);
  });

  describe('Matching', function() {

    it('Matches custom commands', function() {
      expect(this.command.match('login')).to.equal(true);
    });

  });

  describe('Processing', function() {

    it('Fails when the dispatcher fails', function(done) {
      this.dispatcher
        .mock('dispatch')
        .takes('help', function(){})
        .calls(1, [new Error('failed')]);

      this.command.process('login', function(err) {
        expect(err.message).to.equal('failed');
        done();
      });
    });

    it('Stops when the dispatch cannot match the command', function(done) {
      this.dispatcher
        .mock('dispatch')
        .takes('help', function(){})
        .calls(1, [null, false]);

      this.command.process('login', function(err) {
        expect(err.message).to.contain('match');
        done();
      });
    });

    it('Runs the matched commands in the dispatcher', function(done) {
      this.dispatcher
        .mock('dispatch')
        .takes('help', function(){})
        .calls(1, [null, true, null]);

      this.command.process('login', done);
    });

  });

});
