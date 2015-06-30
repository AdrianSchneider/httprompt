'use strict';

/**
 * Config commands
 *
 * @param {Object} config
 */
module.exports = function ConfigCommands(config) {
  var keywords = ['config set', 'config get', 'config list'];

  /**
   * Check if this should handle the line
   *
   * @param {String} line - an input line from the repl
   * @return {Boolean}
   */
  this.match = function(line) {
    return keywords.filter(function(keyword) {
      return line.indexOf(keyword) === 0;
    }).length >= 1;
  };

  /**
   * Processes the line after matching
   *
   * @param {String} line - an input line from the repl
   * @param {Functoin} done - called when complete
   *
   */
  this.process = function(line, done) {
    var items = line.toLowerCase().split(' ');

    if (items[1] === 'list') return done(null, config);
    if (items[1] === 'get') return handleGet(items[2], done);
    if (items[1] === 'set') return handleSet(items[2], items[3], done);
    done();
  };

  /**
   * Returns the help for this module
   *
   * @return {Array}
   */
  this.getHelp = function() {
    return [
      'config set <key> <value>: changes a config option',
      'config get <key>: gets a single config value',
      'config list: lists all config options and values'
    ];
  };

  /**
   * Handles get command
   *
   * @param {String} key - requested config key
   * @param {Function} done
   */
  var handleGet = function(key, done) {
    if (typeof config[key] === 'undefined') {
      return done(new Error('Config key "' + key + '" does not exist'));
    }
    return done(null, config[key]);
  };

  /**
   * Handles set command
   *
   * @param {String} key - requested config key
   * @param {String} value - new config value
   * @param {Function} done
   */
  var handleSet = function(key, value, done) {
    if (typeof config[key] === 'undefined') {
      return done(new Error('Config key "' + key + '" does not exist'));
    }

    if (value === 'true')  value = true;
    if (value === 'false') value = false;
    if (/([0-9]+)/.test(value)) value = parseInt(value, 10);

    config[key] = value;
    return done(null, 'ok');
  };
};
