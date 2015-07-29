'use strict';

var fs    = require('fs');
var spawn = require('child_process').spawn;

module.exports = {
  renderResponse: function(response, done) {
    if(response.getBody) return open(response.getBody(), done);
    return open(response, done);
  },
  renderError: function(error, done) {
    return open(error, done);
  }
};

function open(data, done) {
  fs.writeFile('/tmp/jsonfui', JSON.stringify(data), function(err) {
    if (err) return done(err);

    var process = spawn('jsonfui', ['/tmp/jsonfui'], { stdio: 'inherit' });
    process.on('close', function() {
      done();
    });
  });
}
