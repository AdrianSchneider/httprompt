'use strict';

var expect = require('chai').expect;
var Dispatcher = require('../../src/dispatcher');

describe('Dispatcher', function() {

  beforeEach(function() {
    this.commands = [{
      match: function(line) { return line === 'a'; },
      process: function(line, done) { done(null, { name: 'sup' }); }
    }, {
      match: function(line) { return line === 'fail'; },
      process: function(line, done) { done(new Error('failed')); }
    }];
    this.dispatcher = new Dispatcher(this.commands);
  });

  it('Calls with true,result when matching succesfully', function(done) {
    this.dispatcher.dispatch('a', function(err, status, result) {
      if(err) return done(err);
      expect(status).to.equal(true);
      expect(result).to.deep.equal({ name: 'sup' });
      done();
    });
  });

  it('Calls with false when no match was found', function(done) {
    this.dispatcher.dispatch('made up', function(err, status, result) {
      if(err) return done(err);
      expect(status).to.equal(false);
      done();
    });
  });

  it('Fails when processing fails', function(done) {
    this.dispatcher.dispatch('fail', function(err) {
      expect(err.message).to.equal('failed');
      done();
    });
  });

});
