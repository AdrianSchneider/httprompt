'use strict';

module.exports = {
  renderResponse: function(response, done) {
    if(!response) return done();
    console.log(typeof response.serialize !== 'undefined' ? response.serialize() : JSON.stringify(response, null, 2));
    done();
  },
  renderError: function(error, done) {
    console.log('Error:', error.message);
    done();
  }
};
