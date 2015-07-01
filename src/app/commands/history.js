'use strict';

var _       = require('underscore');
var Command = require('./command');
var Request = require('../../app/request');

module.exports = function(session, renderer) {
  
  return [
    new Command('open', function(request, done) {
      var entry = session.getLastResponse();
      if (!entry) return done(null, 'No response to show');
      renderer.renderExternal(entry.getResponse(), done);
    }),
    new Command(
      'open <command>',
      function(request) {
        return request.getLine().indexOf('open ') === 0;
      },
      function(request, done) {
        var childRequest = new Request(request.getLine().substr(5));
        this.getDispatcher().dispatch(childRequest, request, function(err, result, response) {
          if (err) return done(err);
          if (!result) return done(new Error('Unknown command: ' + childRequest.getLine()));

          renderer.renderExternal(response, done);
        });
      }
    )
  ];

};
