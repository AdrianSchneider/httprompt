'use strict';

module.exports = function HistoryCommands(client, renderer) {

  this.match = function(line) {
    return line === 'open';
  };

  this.process = function(line, done) {
    renderer.renderExternal({ 
      getHeaders: function() { return { 'content-type': 'application/json' }; },
      getBody: function() { return [1, 2, 3]; }
    }, function(err) {
      if(err) return done(err);
      return done(null, null);
    });
  };

  this.getHelp = function() {

  };

};
