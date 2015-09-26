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

    it('Lists all of the config values', function() {
      this.command = this.getCommand('config list');
      this.config
        .mock('getGlobals')
        .returns({ config: true });

      var output = this.command.process(new Request());
      expect(output).to.deep.equal({ config: true });
    });

  });

  describe('config set <key> <value>', function() {

    beforeEach(function() {
      this.command = this.getCommand('config set');
    });

    it('Errors when the requested key does not exist', function() {
      var request = new Request('', { key: 'madeup', value: 'invalid' });
      this.config.mock('has').takes('madeup').returns(false);
      var f = function() { this.command.process(request); }.bind(this);
      expect(f).to.throw(Error, 'does not exist');
    });

    it('Sets the key', function() {
      var request = new Request('', { key: 'key', value: 'value' });
      this.config.mock('has').takes('key').returns(true);
      this.config.mock('set').takes('key', 'value');
      this.command.process(request);
    });

    it('Sets the key and casts true to boolean', function() {
      var request = new Request('', { key: 'doit', value: 'true' });
      this.config.mock('has').takes('doit').returns(true);
      this.config.mock('set').takes('doit', true);
      this.command.process(request);
    });

    it('Sets the key and casts false to boolean', function() {
      var request = new Request('', { key: 'doit', value: 'false' });
      this.config.mock('has').takes('doit').returns(true);
      this.config.mock('set').takes('doit', false);
      this.command.process(request);
    });

    it('Sets the key and casts numbers to numbers', function() {
      var request = new Request('', { key: 'cats', value: '8' });
      this.config.mock('has').takes('cats').returns(true);
      this.config.mock('set').takes('cats', 8);
      this.command.process(request);
    });

  });

});
