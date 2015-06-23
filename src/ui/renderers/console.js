'use strict';

module.exports = {
  renderResponse: function(response, done) {
    console.log(response.serialize ? response.serialize() : JSON.stringify(response, null, 2));
    done();
  },
  renderError: function(error, done) {
    console.log('Error:', error.message);
    done();
  }
};
