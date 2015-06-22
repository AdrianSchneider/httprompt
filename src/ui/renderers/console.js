'use strict';

module.exports = function ConsoleRenderer(prompt) {
  return {
    renderResponse: function(response) {
      console.log(response);
      prompt.start();
    },
    renderError: function(error) {
      console.log('Error', error);
      prompt.start();
    }
  };
};
