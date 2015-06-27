'use strict';

/**
 * Responsible for rendering responses
 *
 * @param {Object} config
 */
module.exports = function(config, renderers) {

  /**
   * Renders a response using one of the viewers
   *
   * @param {String} name
   * @param {Object} data
   * @param {Function} done
   */
  this.render = function(name, data, done) {
    if (typeof renderers[name] === 'undefined') {
      return done(new Error('Renderer ' + name + ' is not registered'));
    }

    if (data instanceof Error) { 
      return renderers[name].renderError(data, done);
    }

    renderers[name].renderResponse(data, done);
  };

  /**
   * Renders a response using an external viewer
   *
   * @param {String} name
   * @param {Object} data
   * @param {Function} done
   */
  this.renderExternal = function(response, done) {
    this.render(
      getExternalViewer(response),
      response,
      done
    );
  };

  /**
   * Picks which external viewer to use
   *
   * @param {HttpResponse} response
   * @return {Object}
   */
  var getExternalViewer = function(response) {
    var type = getContentType(response);
    if (!type || !config.get("external." + type)) {
      return config.get('external');
    }
    return config.get("external." + type);
  };

  /**
   * Figures out which content type to use for a response
   *
   * @param {HttpResponse} response
   * @return {String}
   */
  var getContentType = function(response) {
    var header = response.getHeaders()['content-type'] || null;
    if (header && header.indexOf('json') !== -1) return 'json';
  };

};
