'use strict';

var _            = require('underscore');
var HttpResponse = require('../../http/response');

module.exports = function HistoryCommands(client, renderer) {

  this.match = function(line) {
    return line === 'open';
  };

  this.process = function(line, done) {
    var history = client.getHistory();
    var latest = _.last(history);
    if (!latest) return done(null, 'No response to show');
    renderer.renderExternal(latest, done);
  };

  this.getHelp = function() {

  };

};
