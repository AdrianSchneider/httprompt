'use strict';

module.exports = function HelpCommand() {
  var commandProviders = [];
  var dispatcher;

  this.setDispatcher = function(d) {
    dispatcher = d;
    commandProviders = d.getCommands();
  };

  this.match = function(line) {
    return line === 'help';
  };

  this.process = function(line, done) {
    return commandProviders
      .filter(function(provider) {
        return provider.getHelp;
      })
      .reduce(function(out, provider) {
        out = out.concat([provider.getHelp()]);
        out.sort(function(a, b) {
          a = a[0].split(' ')[0];
          b = b[0].split(' ')[0];
          return a === b ? 0 : (a < b ? -1 : 1);
        });
        return out;
      }, [])
      .reduce(function(out, groups) {
        out = out.concat(groups);
        return out;
      }, []);
  };

};
