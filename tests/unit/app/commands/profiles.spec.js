'use strict';

var expect          = require('chai').expect;
var nodemock        = require('nodemock');
var Request         = require('../../../../src/app/request');
var profileCommands = require('../../../../src/app/commands/profiles');

describe('Profile Commands', function() {

  beforeEach(function() {
    this.profiles = nodemock.mock();
    this.session = nodemock.mock();
    this.dispatcher = nodemock.mock();
    this.config = { getProfiles: function() { return this.profiles; }.bind(this) };
    this.commands = profileCommands(this.config, this.session);
    this.commands.forEach(function(command) {
      command.setDispatcher(this.dispatcher);
    }.bind(this));
    this.getCommand = function(search) { return this.commands.filter(function(command) { return command.getHelp().indexOf(search) === 0; })[0]; }.bind(this);
  });

  afterEach(function() {
    this.profiles.assertThrows();
    this.session.assertThrows();
  });

  describe('profiles list', function() {

    it('returns a list of profiles', function() {
      this.profiles.mock('getList').returns(['a', 'b', 'c']);
      var output = this.getCommand('profiles list').process(new Request(''));
      expect(output).to.deep.equal(['a', 'b', 'c']);
    });

  });

  describe('profiles switch <name>', function() {

    it('tells the session to switch to the requested profile', function(done) {
      this.session
        .mock('switchProfile')
        .takes('bob', this.dispatcher, function(){})
        .calls(2, []);

      this.getCommand('profiles switch').process(new Request('', { name: 'bob' }), done);
    });

  });

  describe('profiles add <name> <baseUrl>', function() {

    it('Adds a new profile', function() {
      this.profiles.mock('add').takes('bob', 'http://');
      this.getCommand('profiles add').process(new Request('', { name: 'bob', baseUrl: 'http://' }));
    });

  });

  describe('profiles remove <name>', function() {

    it('removes the requested profile', function() {
      this.profiles.mock('remove').takes('bob');
      this.getCommand('profiles remove').process(new Request('', { name: 'bob' }));
    });

  });

  describe('profile vars', function() {

    it('lists the vars', function() {
      var session = nodemock.mock();
      this.session.mock('getProfile').returns(session);
      session.mock('getVariables').returns({ a: "b" });

      var output = this.getCommand('profile vars').process(new Request(''));
      expect(output).to.deep.equal({ a: "b" });
    });

  });

  describe('profile vars set <key> <value>', function() {

    it('sets the profile variable', function() {
      var session = nodemock.mock();
      this.session.mock('getProfile').returns(session);
      session.mock('setVariable').takes('key', 'value');

      this.getCommand('profile vars set').process(new Request('', { key: 'key', value: 'value'}));
    });

  });

});
