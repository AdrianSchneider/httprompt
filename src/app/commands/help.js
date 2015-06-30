'use strict';

var Command = require('./command');

module.exports = function() {
  return [
    new Command(
      'help: prints out this help message',
      function(request, done) {
        return this.dispatcher.getCommands()
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
      }
    )
  ];
};
