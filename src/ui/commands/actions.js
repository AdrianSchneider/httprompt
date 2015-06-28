'use strict';

var _ = require('underscore');
var async = require('async');

/**
 * Providers custom actions by looking into the configuration profile actions
 * and tests against those, running them through the dispatch loop again
 *
 * @param {ConfigProfiles] profiles
 * @param {PromptDispatcher} dispatcher
 */
module.exports = function CustomActionCommands(profiles) {
  var matchers = [];
  var processors = [];
  var dispatcher;

  this.setDispatcher = function(d) {
    dispatcher = d;
  };

  /**
   * Matches when any of the profile's custom actions match
   *
   * @param {String} line
   * @return {Boolean}
   */
  this.match = function(line) {
    return _.some(matchers, function(matcher) {
      return matcher.regex.test(line);
    });
  };

  /**
   * Runs a custom command's action using the dispatcher
   *
   * @param {String} line
   * @param {Function} done
   */
  this.process = function(line, done) {
    var action = _.find(matchers, function(matcher) {
      return matcher.regex.test(line);
    });

    async.eachSeries(action.commands, function(line, next) {
      dispatcher.dispatch(line, function(err, result, done) {
        if (err) return next(err);
        if (!result) return next(new Error('"' + line + '" does not match any commands'));
        return next();
      });
    }, function(err) {
      if (err) return done(err);
      return done();
    });
  };

  /**
   * Updates the matchers and processers using data from the new profile
   *
   * @param {ConfigProfile} profile
   */
  var changeProfile = function(profile) {
    var actions = profile.getActions();
    matchers = Object.keys(actions).map(function(action) {
      return {
        commands: actions[action],
        regex: new RegExp('^' + action.replace(/<([-a-z0-9]*)>/gi, function() { return '([^ ]+)'; }) + '$')
      };
    });
  };

  changeProfile(profiles.getActive());
  profiles.on('switch', changeProfile);

};
