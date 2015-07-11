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

    it('returns a list of profiles', function(done) {
      this.profiles.mock('getList').returns(['a', 'b', 'c']);
      this.getCommand('profiles list').process(new Request(''), function(err, output) {
        expect(output).to.deep.equal(['a', 'b', 'c']);
        done();
      });
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

    it('catches and passes the error', function(done) {
      this.session
        .mock('switchProfile')
        .takes('madeup', this.dispatcher, function(){})
        .calls(2, [new Error('made up')]);

      this.getCommand('profiles switch').process(new Request('', { name: 'madeup' }), function(err) {
        expect(err.message).to.equal('made up');
        done();
      });
    });

  });

  describe('profiles add <name> <baseUrl>', function() {

    it('Adds a new profile', function(done) {
      this.profiles.mock('add').takes('bob', 'http://');
      this.getCommand('profiles add').process(new Request('', { name: 'bob', baseUrl: 'http://' }), done);
    });

  });

  describe('profiles remove <name>', function() {

    it('removes the requested profile', function(done) {
      this.profiles.mock('remove').takes('bob');
      this.getCommand('profiles remove').process(new Request('', { name: 'bob' }), done);
    });

  });

  describe('profile vars', function() {

    it('lists the vars', function(done) {
      var session = nodemock.mock();
      this.session.mock('getProfile').returns(session);

      session
        .mock('getVariables')
        .returns({ a: "b" });

      this.getCommand('profile vars').process(new Request(''), function(err, out) {
        expect(out).to.deep.equal({ a: "b" });
        done();
      });
    });

  });

  describe('profile vars set <key> <value>', function() {

    it('sets the profile variable', function(done) {
      var session = nodemock.mock();
      this.session.mock('getProfile').returns(session);
      session.mock('setVariable').takes('key', 'value');
      this.getCommand('profile vars set').process(new Request('', { key: 'key', value: 'value'}), done);
    });

  });

});
