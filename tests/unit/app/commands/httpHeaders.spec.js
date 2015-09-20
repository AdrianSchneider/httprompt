'use strict';

var expect             = require('chai').expect;
var nodemock           = require('nodemock');
var Request            = require('../../../../src/app/request');
var httpHeaderCommands = require('../../../../src/app/commands/httpHeaders');

describe('HTTP Header Commands', function() {

  beforeEach(function() {
    this.session = nodemock.mock();
    this.commands = httpHeaderCommands(this.session);
    this.getCommand = function(search) { return this.commands.filter(function(command) { return command.getHelp().indexOf(search) === 0; })[0]; }.bind(this);
  });

  afterEach(function() {
    this.session.assertThrows();
  });

  describe('header set <name> <value>', function() {

    it('Sets the http header on the session', function() {
      var request = new Request('', { name: 'authorization', value: 'bananas' });
      this.command = this.getCommand('header set');
      this.session.mock('setNextHeader').takes('authorization', 'bananas');
      this.command.process(request);
    });

  });

  describe('header stick <name> <value>', function() {

    it('Sets the http header permanently on the session', function() {
      var request = new Request('', { name: 'authorization', value: 'bananas' });
      this.command = this.getCommand('header stick');
      this.session.mock('setHeader').takes('authorization', 'bananas');
      this.command.process(request);
    });

  });

  describe('header unstick <name>', function() {

    it('Unsets the header', function() {
      var request = new Request('', { name: 'authorization' });
      this.command = this.getCommand('header unset');
      this.session.mock('unsetHeader').takes('authorization');
      this.command.process(request);
    });

  });

});
