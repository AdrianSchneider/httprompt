'use strict';

var request            = require('request');
var readline           = require('readline');
var Dispatcher         = require('./dispatcher');
var Prompt             = require('./ui/prompt');
var httpCommands       = require('./ui/commands/http');
var httpHeaderCommands = require('./ui/commands/httpHeaders');
var historyCommands    = require('./ui/commands/history');
var configCommands     = require('./ui/commands/config');
var profileCommands    = require('./ui/commands/profiles');
var customCommands     = require('./ui/commands/actions');
var Renderer           = require('./ui/renderer');
var HttpClient         = require('./http/client');
var Profile            = require('./config/profile');
var ConfigPersistence  = require('./config/persistence');
var Session            = require('./session/session');

/**
 * Application setup
 * Exports a ready Prompt
 *
 * @param {String}   configFilename
 * @param {Stream}   stdin
 * @param {Stream}   stdout
 * @param {String}   profileName
 * @param {Function} done
 */
module.exports = function(configFilename, stdin, stdout, profileName, done) {
  var loader = new ConfigPersistence(configFilename);
  loader.load(function(err, config) {
    if (err) return done(err);

    var session;
    try {
      session = new Session(config.getProfiles(), profileName);
    } catch (e) {
      return done(e);
    }

    var client = new HttpClient(session);

    var commands = [
      configCommands(config),
      historyCommands(client, renderer),
      profileCommands(config, client),
      httpCommands(client),
      httpHeaderCommands(session),
      customCommands(session)
    ].reduce(function(out, items) { return out.concat(items); }, []);

    var dispatcher = new Dispatcher(session, [commands]);

    var renderer = new Renderer(config, {
      console: require('./ui/renderers/console'),
      jsonfui: require('./ui/renderers/jsonfui')
    });

    var prompt = new Prompt(
      readline,
      dispatcher,
      renderer,
      { input: stdin, output: stdout }
    );

    return done(null, prompt);
  });
};
