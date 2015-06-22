'use strict';

var readline = require('readline');

/**
 * Wraps a readline prompt with some application-centric events and methods
 *
 * @param {Array}    providers - Command providers that respond to inputs
 * @param {Renderer} renderer  - Responds to errors/responses to the user
 * @param {Object}   options
 * @param {Stream}   options.input  - The input stream for the repl
 * @param {Stream}   options.output - The input stream for the repl
 */
module.exports = function Prompt(commandProviders, renderer, options) {
  var rl = readline.createInterface(options);

  /**
   * Starts the prompt
   */
  this.start = function() {
    rl.prompt();
  };

  /**
   * Called whenever a line is received from the repl
   *
   * @param {String} line - line from repl
   */
  var onLine = function(line) {
    rl.pause();
    if (!line) return afterResponse();

    var matched = commandProviders.filter(function(provider) {
      return provider.match(line);
    })[0];

    if (!matched) {
      return renderer.renderError(
        new Error('Unknown command; type "help" for some ideas'),
        afterResponse
      );
    }

    matched.process(line, function(err, response) {
      if (err) return renderer.renderError(err, afterResponse);
      renderer.renderResponse(response, afterResponse);
    });
  };

  /**
   * Called after rendering
   */
  var afterResponse = function() {
    rl.prompt();
  };

  rl.on('line', onLine);
};
