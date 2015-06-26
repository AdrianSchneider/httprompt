'use strict';

/**
 * Wraps a readline prompt with some application-centric events and methods
 *
 * @param {Array}    providers - Command providers that respond to inputs
 * @param {Renderer} renderer  - Responds to errors/responses to the user
 * @param {Object}   options
 * @param {Stream}   options.input  - The input stream for the repl
 * @param {Stream}   options.output - The input stream for the repl
 */
module.exports = function Prompt(readline, commandProviders, renderer, options) {
  var rl = readline.createInterface(options);
  rl.history = ['test'];
  rl.historyIndex = 0;

  /**
   * Starts the prompt
   */
  this.start = function() {
    rl.setPrompt('httprompt> ');
    rl.prompt();
    return rl;
  };

  /**
   * Called whenever a line is received from the repl
   *
   * @param {String} line - line from repl
   */
  var onLine = function(line) {
    rl.pause();
    if (line === '')     return afterResponse();
    if (line === 'help') return renderer.render('console', getHelp(), afterResponse);

    var matched = commandProviders.filter(function(provider) { return provider.match(line); })[0];
    if (!matched) {
      return renderer.render(
        'console',
        new Error('Unknown command; type "help" for some ideas'),
        afterResponse
      );
    }

    matched.process(line, function(err, response) {
      if (err) return renderer.render('console', err, afterResponse);
      renderer.render('console', response, afterResponse);
    });
  };

  /**
   * Called after rendering
   */
  var afterResponse = function() {
    rl.prompt();
  };

  /**
   * Fetches the help text
   *
   * @return {Array}
   */
  var getHelp = function() {
    return commandProviders
      .filter(function(provider) {
        return provider.getHelp;
      })
      .reduce(function(out, provider) {
        out = out.concat([provider.getHelp()]);
        out.sort(function(a, b) {
          a = a[0].split(' ')[0];
          b = b[0].split(' ')[0];
          return a === b ? 0 : (a < b ? -1 : 1);
        });
        return out;
      }, [])
      .reduce(function(out, groups) {
        out = out.concat(groups);
        return out;
      }, []);
  };

  rl.on('line', onLine);
};
