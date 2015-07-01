'use strict';

var async              = require('async');
var request            = require('request');
var readline           = require('readline');
var Dispatcher         = require('./app/dispatcher');
var Request            = require('./app/request');
var helpCommands       = require('./app/commands/help');
var httpCommands       = require('./app/commands/http');
var httpHeaderCommands = require('./app/commands/httpHeaders');
var historyCommands    = require('./app/commands/history');
var configCommands     = require('./app/commands/config');
var profileCommands    = require('./app/commands/profiles');
var Renderer           = require('./ui/renderer');
var Prompt             = require('./ui/prompt');
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

    var renderer = new Renderer(config, {
      console: require('./ui/renderers/console'),
      jsonfui: require('./ui/renderers/jsonfui')
    });

    var client = new HttpClient(session);

    var commands = [
      helpCommands(),
      configCommands(config),
      historyCommands(session, renderer),
      profileCommands(config, session),
      httpCommands(client),
      httpHeaderCommands(session),
    ].reduce(function(out, items) { return out.concat(items); }, []);

    var dispatcher = new Dispatcher(session, commands, config);

    var prompt = new Prompt(
      readline,
      dispatcher,
      renderer,
      { input: stdin, output: stdout }
    );

    if (profileName !== 'default') {
      prompt.rename(session.getProfile().getName());
    }

    session.on('profiles.switch', function(profile) {
      prompt.rename(profile.getName());
    });

    async.eachSeries(session.getProfile().getStartupTasks(), function(line, next) {
      dispatcher.dispatch(new Request(line), next);
    }, function(err) {
      if (err) return done(err);
      return done(null, prompt);
    });
  });
};
