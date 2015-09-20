'use strict';

var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Request      = require('../../../../src/app/request');
var helpCommands = require('../../../../src/app/commands/help');
var Command      = require('../../../../src/app/commands/command');

var groups = [
  { text: "Your custom commands", key: "user" },
  { text: "Built in commands", key: "command" },
  { text: "Helper functions -- $(helper_call)", key: "helper" }
];

var helpCommand = helpCommands(groups)[0];

describe('Help Command', function() {

  var normalCommand = new Command('get <path>', function(request) { return '200'; }, null, 'command');
  var userCommand   = new Command('hello', function(request) { return 'world'; }, null, 'user');
  var helperCommand = new Command('echo <message>', function(request) { return 'echo'; }, null, 'helper');

  var setCommands = function(commands) {
    helpCommand.setDispatcher({
      getCommands: function() { return commands; }
    });
  };

  describe('help', function() {

    it('Collapses empty groups', function() {
      setCommands([]);
      var output = helpCommand.process(new Request('help'));
      expect(output).to.equal('');
    });

    it('Prints each item inside its group', function() {
      setCommands([normalCommand]);
      var output = helpCommand.process(new Request('help'));
      expect(output).to.contain('Built in commands:\n\n\tget <path>');
    });

    it('Sorts the commands inside each group', function() {
      setCommands([
        new Command('b', function(request) { return '200'; }, null, 'command'),
        new Command('a', function(request) { return '200'; }, null, 'command')
      ]);
      var output = helpCommand.process(new Request('help'));
      expect(output).to.contain('\ta\n\tb');
    });

  });

});
