'use strict';

var _            = require('underscore');
var Command      = require('./command');
var HttpResponse = require('../../http/response');

module.exports = function(session, renderer) {
  
  return [
    new Command('open', function(request, done) {
      var entry = session.getLastResponse();
      if (!entry) return done(null, 'No response to show');
      renderer.renderExternal(entry.getResponse(), done);
    })
  ];

};
