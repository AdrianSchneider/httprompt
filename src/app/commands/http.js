'use strict';

var async   = require('async');
var Command = require('./command');
var parse   = require('../request.parser');

/**
 * HTTP Client Command Handlers
 * Intercepts any commands that look like HTTP calls
 *
 * @author Adrian Schneider <adrian@compiledintent.com>
 * @param {HttpClient} client
 */
module.exports = function HttpCommands(client) {
  var main = function() {
    return [
      new Command('GET <path>',            match('get'),    handle('get')),
      new Command('POST <path> <payload>', match('post'),   handle('post')),
      new Command('PUT <path> <payload>',  match('put'),    handle('put')),
      new Command('DELETE <path>',         match('delete'), handle('delete'))
    ];
  };

  var match = function(method) {
    return function(response) {
      return (new RegExp('^' + method, 'i')).test(response.getLine());
    };
  };

  var handle = function(method) {
    return function(request, done) {
      var line = request.getLine();
      var parts = line.split(' ');

      var method = parts[0].toLowerCase();
      var url = parts[1];
      var payload = parse(parts.slice(2).join(' ')) || null;

      var commands = {
        'get'    : async.apply(client.get, url, {}),
        'post'   : async.apply(client.post, url, payload),
        'put'    : async.apply(client.put, url, payload),
        'delete' : async.apply(client.del, url)
      };

      commands[method](done);
    };
  };

  return main();
};
