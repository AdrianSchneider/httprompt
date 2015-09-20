'use strict';

var async   = require('async');
var spawn   = require('child_process').spawn;
var Command = require('./command');

/**
 * Config commands
 *
 * @param {Object} config
 */
module.exports = function(config) {
  var main = function() {
    return [
      new Command('config list',              getList),
      new Command('config get <key>',         getConfig),
      new Command('config set <key> <value>', setConfig),
      new Command('config edit',              editConfig),
      new Command('config.<key>',             getConfig, null, 'helper')
    ];
  };

  var getList = function(request) {
    return config.getGlobals();
  };

  var getConfig = function(request) {
    var key = request.get('key');
    if (!config.has(key)) {
      throw new Error('Config key "' + key + '" does not exist');
    }

    return config.get(key);
  };

  var setConfig = function(request) {
    var key = request.get('key');
    var value = request.get('value');

    if (!config.has(key)) {
      throw new Error('Config key "' + key + '" does not exist');
    }

    if (value === 'true')  value = true;
    if (value === 'false') value = false;
    if (/([0-9]+)/.test(value)) value = parseInt(value, 10);

    config.set(key, value);
    return 'ok';
  };

  var editConfig = function(request, done) {
    async.series({
      save: function(next) {
        config.save(next);
      },
      edit: function(next) {
        var name = getEditor();
        if (!name) return done(new Error('No "editor" configured'));
        var editor = spawn(name, [config.getFilename()], { stdio: 'inherit' });
        editor.on('close', next);
      },
      load: function(next) {
        config.load(next);
      }
    }, function(err) {
      if (err) return done(err);
      return done();
    });
  };

  var getEditor = function() {
    return config.get('editor') || process.env.VISUAL || process.env.EDITOR;
  };

  return main();

};
