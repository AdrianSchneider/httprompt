'use strict';

var expect     = require('chai').expect;
var nodemock   = require('nodemock');
var Dispatcher = require('../../../src/app/dispatcher');
var Request    = require('../../../src/app/request');

describe('Dispatcher', function() {

  beforeEach(function() {
    this.user = nodemock.mock();
    this.commands = [{
      match: function(line) { return line.getLine() === 'a'; },
      process: function(line, done) { done(null, { name: 'sup' }); },
      setDispatcher: function() {}
    }, {
      match: function(line) { return line.getLine() === 'fail'; },
      process: function(line, done) { done(new Error('failed')); },
      setDispatcher: function() {}
    }];
    this.dispatcher = new Dispatcher(this.user, this.commands);
  });

  afterEach(function() {
    this.user.assertThrows();
  });

  it('Calls with true,result when matching succesfully', function(done) {
    //this.user
    //  .mock('log')
    //  .takes('a', { name: 'sup' });

    this.dispatcher.dispatch(new Request('a'), function(err, status, result) {
      if(err) return done(err);
      expect(status).to.equal(true);
      expect(result).to.deep.equal({ name: 'sup' });
      done();
    });
  });

  it('Calls with false when no match was found', function(done) {
    this.dispatcher.dispatch(new Request('made up'), function(err, status, result) {
      if(err) return done(err);
      expect(status).to.equal(false);
      done();
    });
  });

  it('Fails when processing fails', function(done) {
    this.dispatcher.dispatch(new Request('fail'), function(err) {
      expect(err.message).to.equal('failed');
      done();
    });
  });

});
