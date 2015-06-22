'use strict';

module.exports = {
  renderResponse: function(response, done) {
    console.log(response.getBody ? response.getBody() : response);
    done();
  },
  renderError: function(error, done) {
    console.log('Error', error);
    done();
  }
};
