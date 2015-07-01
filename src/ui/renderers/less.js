'use strict';

var fs    = require('fs');
var spawn = require('child_process').spawn;

module.exports = {
  renderResponse: function(response, done) {
    var output = typeof response.serialize !== 'undefined' ? response.serialize() : JSON.stringify(response, null, 2);
    open(output, done);
  },
  renderError: function(error, done) {
    open(error.toString(), done);
  }
};

function open(data, done) {
  fs.writeFile('/tmp/httprompt', data, function(err) {
    if (err) return done(err);

    var process = spawn('less', ['/tmp/httprompt'], { stdio: 'inherit' });
    process.on('close', function() {
      done();
    });
  });
}
