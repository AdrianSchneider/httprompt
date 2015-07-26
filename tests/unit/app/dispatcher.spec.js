'use strict';

var expect     = require('chai').expect;
var nodemock   = require('nodemock');
var Dispatcher = require('../../../src/app/dispatcher');
var Request    = require('../../../src/app/request');

describe('Dispatcher', function() {

  beforeEach(function() {
    this.session = nodemock.mock();
    this.session.log = function() {};
    this.profile = nodemock.mock();
    this.profile.mock('getCommands').takesF(function() { return true; }).returns([]); 
    this.session.on = function(){};
    this.session.getProfile = function() { return this.profile; }.bind(this);
    this.commands = [{
      match: function(line) { return line.getLine() === 'a'; },
      process: function(line, done) { done(null, { name: 'sup' }); },
      setDispatcher: function() {}
    }, {
      match: function(line) { return line.getLine() === 'fail'; },
      process: function(line, done) { done(new Error('failed')); },
      setDispatcher: function() {}
    }, {
      match: function(line) { return line.getLine() === 'sync'; },
      process: function(line) { return 'response'; },
      setDispatcher: function() {}
    }, {
      match: function(line) { return line.getLine() === 'sync error'; },
      process: function(line) { throw new Error('sync fail'); },
      setDispatcher: function() {}
    }];
    this.dispatcher = new Dispatcher(this.session, this.commands);
  });

  afterEach(function() {
    this.session.assertThrows();
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

  it('Supports synchronous processors', function(done) {
    this.dispatcher.dispatch(new Request('sync error'), function(err, status, response) {
      expect(err.message).to.equal('sync fail');
      done();
    });
  });

});
