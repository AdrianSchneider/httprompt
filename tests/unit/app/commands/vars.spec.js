'use strict';

var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Request      = require('../../../../src/app/request');
var varsCommands = require('../../../../src/app/commands/vars');

describe('Variable Commands', function() {

  beforeEach(function() {
    this.session = nodemock.mock();
    this.commands = varsCommands(this.session);
    this.getCommand = function(search) {
      return this.commands.filter(function(command) {
        return command.getHelp().indexOf(search) === 0;
      })[0];
    }.bind(this);
  });

  afterEach(function() {
    this.session.assertThrows();
  });

  describe('vars set <key> <value>', function() {

    it('Sets the session variable synchronously', function() {
      var command = this.getCommand('vars set');
      var request = new Request('', { key: 'name', value: 'adrian' });
      this.session.mock('set').takes('name', 'adrian');
      command.process(request);
    });

  });

  describe('vars unset <key>', function() {

    it('Unsets the session variable synchronously', function() {
      var command = this.getCommand('vars unset');
      var request = new Request('', { key: 'name' });
      this.session.mock('set').takes('name', undefined);
      command.process(request);
    });

  });

  describe('vars get <key>', function() {

    it('Gets the session variable synchronously', function() {
      var command = this.getCommand('vars get');
      var request = new Request('', { key: 'name' });
      this.session.mock('get').takes('name').returns('adrian');
      expect(command.process(request)).to.equal('adrian');
    });

  });

  describe('input.<key>', function() {

    it('Gets the input key from the parent request', function() {
      var command = this.getCommand('input.');
      var request = new Request('', { key: 'name' }, new Request('', { name: 'hello' }));
      expect(command.process(request)).to.deep.equal('hello');
    });

    it('Throws an error when key is invalid', function() {
      var command = this.getCommand('input.');
      var request = new Request();
      var f = function() { command.process(request); };
      expect(f).to.throw(Error, 'No parent request');
    });

  });

});
