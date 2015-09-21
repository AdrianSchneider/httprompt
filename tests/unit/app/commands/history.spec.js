'use strict';

var expect          = require('chai').expect;
var nodemock        = require('nodemock');
var Request         = require('../../../../src/app/request');
var historyCommands = require('../../../../src/app/commands/history');

describe('Variable Commands', function() {

  beforeEach(function() {
    this.session = nodemock.mock();
    this.renderer = nodemock.mock();
    this.commands = historyCommands(this.session, this.renderer);
    this.getCommand = function(search) {
      return this.commands.filter(function(command) {
        return command.getHelp().indexOf(search) === 0;
      })[0];
    }.bind(this);
    this.dispatcher = nodemock.mock();

    this.commands.forEach(function(command) {
      command.setDispatcher(this.dispatcher);
    }.bind(this));
  });

  afterEach(function() {
    this.session.assertThrows();
    this.renderer.assertThrows();
    this.dispatcher.assertThrows();
  });

  describe('open', function() {

    it('Renders the last response with the external viewer', function(done) {
      var response = { statusCode: 200 };
      var entry = { getResponse: function() { return response; } };

      this.session
        .mock('getLastResponse')
        .returns(entry);

      this.renderer
        .mock('renderExternal')
        .takes(response, function(){})
        .calls(1);

      this.getCommand('open').process(new Request(), done);
    });

    it('Throws an error when there is no last response', function(done) {
      this.session
        .mock('getLastResponse')
        .returns(null);

      var command = this.getCommand('open');

      this.getCommand('open').process(new Request(), function(err) {
        expect(err.message).to.contain('No items in history');
        done();
      });
    });

  });

  describe('open <command>', function() {

    it('Matches anything starting with "open "', function() {
      var command = this.getCommand('open ');
      expect(command.match(new Request('open lasjdflaj'))).to.equal(true);
    });

    it('Renders a response with an external viewer', function(done) {
      var response = { statusCode: 200 };

      this.dispatcher
        .mock('dispatch')
        .takesF(function(childRequest, request, f) {
          expect(childRequest.getLine()).to.equal('blah');
          return true;
        })
        .calls(2, [null, true, response]);

      this.renderer
        .mock('renderExternal')
        .takes(response, function(){})
        .calls(1);

      this.getCommand('open ').process(new Request('open blah'), done);
    });

  });

  describe('response.<key>', function() {

    before(function() {
      this.body = {
        a: 'ok',
        users: [
          { id: 1, name: 'adrian' }
        ]
      };
      this.response = {
        getResponseCode: function() { return 200; },
        getHeaders: function() { return {}; },
        getBody: function() { return this.body; }.bind(this)
      };
      this.entry = { getResponse: function() { return this.response; }.bind(this) };
    });

    it('Can grab top level response fields', function() {
      this.session
        .mock('getLastResponse')
        .returns(this.entry);

      var command = this.getCommand('response.');
      var request = new Request('', { key: 'responseCode' });
      expect(command.process(request)).to.equal(200);
    });

    it('Can grab fields from body', function() {
      this.session
        .mock('getLastResponse')
        .returns(this.entry);

      var command = this.getCommand('response.');
      var request = new Request('', { key: 'body.a' });
      expect(command.process(request)).to.equal('ok');
    });

    it('Can grab dotted keys from body', function() {
      this.session
        .mock('getLastResponse')
        .returns(this.entry);

      var command = this.getCommand('response.');
      var request = new Request('', { key: 'body.users.0.name' });
      expect(command.process(request)).to.equal('adrian');
    });

  });

});
