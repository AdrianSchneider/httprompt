'use strict';

var expect           = require('chai').expect;
var objectId         = require('bson-objectid');
var Request          = require('../../../../src/app/request');
var generateCommands = require('../../../../src/app/commands/generate');

describe('Generate Commands', function() {

  beforeEach(function() {
    this.commands = generateCommands(this.config);
    this.getCommand = function(search) {
      return this.commands.filter(function(command) {
        return command.getHelp().indexOf(search) === 0;
      })[0];
    }.bind(this);
  });

  describe('generate rand', function() {

    it('Generates a random number between min and max', function() {
      var command = this.getCommand('generate rand');
      for (var i = 0; i < 25; i++) {
        var num = command.process(new Request('', { min: 1, max: 10 }));
        expect(num).to.be.gte(1);
        expect(num).to.be.lte(10);
      }
    });

  });

  describe('generate objectid', function() {

    it('Generates an object id', function() {
      var command = this.getCommand('generate objectid');
      var generated = command.process(new Request());
      expect(objectId.isValid(generated)).to.equal(true);
    });

  });

  describe('generate timestamp', function() {

    it('Generates the current timestamp in ms', function() {
      var command = this.getCommand('generate timestamp');
      var generated = command.process(new Request());
      var now = Date.now();
      expect(now - generated).to.be.lt(1000);
    });

  });

});
