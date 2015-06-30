'use strict';

var expect         = require('chai').expect;
var nodemock       = require('nodemock');
var Request        = require('../../../../src/app/request');
var configCommands = require('../../../../src/app/commands/config');

describe('Config Commands', function() {

  beforeEach(function() {
    this.config = nodemock.mock();
    this.commands = configCommands(this.config);
    this.getCommand = function(search) {
      return this.commands.filter(function(command) {
        return command.getHelp().indexOf(search) === 0;
      })[0];
    }.bind(this);
  });

  afterEach(function() {
    this.config.assertThrows();
  });

  describe('config list', function() {

    it('Lists all of the config values', function(done) {
      this.command = this.getCommand('config list');
      this.config
        .mock('serialize')
        .returns({ config: true });

      this.command.process(new Request(), function(err, output) {
        expect(output).to.deep.equal({ config: true });
        done(err);
      });
    });

  });

  describe('config set <key> <value>', function() {

    beforeEach(function() {
      this.command = this.getCommand('config set');
    });

    it('Errors when the requested key does not exist', function(done) {
      var request = new Request('', { key: 'madeup', value: 'invalid' });
      this.config.mock('has').takes('madeup').returns(false);
      this.command.process(request, function(err) {
        expect(err.message).to.contain('does not exist');
        done();
      });
    });

    it('Sets the key', function(done) {
      var request = new Request('', { key: 'key', value: 'value' });
      this.config.mock('has').takes('key').returns(true);
      this.config.mock('set').takes('key', 'value');
      this.command.process(request, done);
    });

    it('Sets the key and casts true to boolean', function(done) {
      var request = new Request('', { key: 'doit', value: 'true' });
      this.config.mock('has').takes('doit').returns(true);
      this.config.mock('set').takes('doit', true);
      this.command.process(request, done);
    });

    it('Sets the key and casts false to boolean', function(done) {
      var request = new Request('', { key: 'doit', value: 'false' });
      this.config.mock('has').takes('doit').returns(true);
      this.config.mock('set').takes('doit', false);
      this.command.process(request, done);
    });

    it('Sets the key and casts numbers to numbers', function(done) {
      var request = new Request('', { key: 'cats', value: '8' });
      this.config.mock('has').takes('cats').returns(true);
      this.config.mock('set').takes('cats', 8);
      this.command.process(request, done);
    });

  });

  describe('config get <key>', function() {

    beforeEach(function() {
      this.command = this.getCommand('config get');
    });

    it('Errors when the requested key does not exist', function(done) {
      var request = new Request('', { key: 'madeup', value: 'invalid' });
      this.config.mock('has').takes('madeup').returns(false);
      this.command.process(request, function(err) {
        expect(err.message).to.contain('does not exist');
        done();
      });
    });

    it('Gets the key', function(done) {
      var request = new Request('', { key: 'key' });
      this.config.mock('has').takes('key').returns(true);
      this.config.mock('get').takes('key').returns('value');
      this.command.process(request, function(err, out) {
        expect(out).to.equal('value');
        done(err);
      });
    });

  });

});
