'use strict';

var _            = require('underscore');
var Command      = require('./command');
var HttpResponse = require('../../http/response');

module.exports = function(client, renderer) {
  
  return [
    new Command('open', function(request, done) {
      var history = client.getHistory();
      var latest = _.last(history);
      if (!latest) return done(null, 'No response to show');
      renderer.renderExternal(latest, done);
    })
  ];

};
