'use strict';

var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Request      = require('../../../src/app/request');
var preprocess = require('../../../src/app/request.preprocessor');

describe('Request Preprocessor', function() {

  beforeEach(function() {
    this.dispatcher = nodemock.mock();
  });

  it('Does nothing when the request has no expressions', function(done) {
    var request = new Request('hello world');
    preprocess(request, this.dispatcher, function(err, req) {
      if(err) return done(err);
      expect(request).to.deep.equal(request);
      done();
    });
  });

  it('Evaluates an embedded expression and returns new request', function(done) {
    this.dispatcher
      .mock('dispatch')
      .takesF(function(request, done) {
        expect(request.getLine()).to.equal('get message');
        expect(done).to.be.a('function');
        return true;
      })
      .calls(1, [null, true, 'hello']);

    var request = new Request('say $(get message)');
    preprocess(request, this.dispatcher, function(err, req) {
      if(err) return done(err);
      expect(req.getLine()).to.equal('say hello');
      done();
    });
  });

  it('Evaluates all remaining expressions and returns final request', function(done) {
    this.dispatcher
      .mock('dispatch')
      .takesF(function(request, done) {
        expect(request.getLine()).to.equal('get message');
        expect(done).to.be.a('function');
        return true;
      })
      .calls(1, [null, true, 'hello']);

    this.dispatcher
      .mock('dispatch')
      .takesF(function(request, done) {
        expect(request.getLine()).to.equal('get name');
        expect(done).to.be.a('function');
        return true;
      })
      .calls(1, [null, true, 'bobby']);

    var request = new Request('say $(get message) $(get name)');
    preprocess(request, this.dispatcher, function(err, req) {
      if(err) return done(err);
      expect(req.getLine()).to.equal('say hello bobby');
      done();
    });
  });


  it('TODO: evaluates expressions inside out to allow $(do something with $(another expression))');

});
