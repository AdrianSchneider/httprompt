'use strict';

module.exports = function(config, renderer) {
  return {
    renderResponse: function(response, done) {
      var type = getContentType(response.getHeaders()['content-type']);

      var name;
      if(type && typeof config[type] !== 'undefined') {
        name = config[type];
      } else {
        name = config.external;
      }

      renderer(name).renderResponse(response, done);
    }
  };
};

function getContentType(header) {
  if (header.indexOf('json') !== -1) {
    return 'json';
  }
}
