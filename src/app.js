'use strict';

var request           = require('request');
var readline          = require('readline');
var Prompt            = require('./ui/prompt');
var HttpCommands      = require('./ui/commands/http');
var HistoryCommands   = require('./ui/commands/history');
var ConfigCommands    = require('./ui/commands/config');
var ProfileCommands   = require('./ui/commands/profiles');
var CustomCommands    = require('./ui/commands/actions');
var Renderer          = require('./ui/renderer');
var HttpClient        = require('./http/client');
var Profile           = require('./config/profile');
var ConfigPersistence = require('./config/persistence');

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

    var renderer = new Renderer(config, {
      console: require('./ui/renderers/console'),
      jsonfui: require('./ui/renderers/jsonfui')
    });

    var configProfiles = config.getProfiles();
    var client = new HttpClient(configProfiles);

    var commandProviders = [
      new ConfigCommands(config),
      new HistoryCommands(client, renderer),
      new ProfileCommands(config, client),
      new HttpCommands(client),
      new CustomCommands(configProfiles)
    ];

    var prompt = new Prompt(
      readline,
      commandProviders,
      renderer,
      { input: stdin, output: stdout }
    );

    return done(null, prompt);
  });
};
