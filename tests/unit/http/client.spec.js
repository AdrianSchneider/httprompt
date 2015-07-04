'use strict';

var _            = require('underscore');
var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var HttpClient   = require('../../../src/http/client');
var HttpResponse = require('../../../src/http/response');

describe('Http Client', function() {

  beforeEach(function() {
    this.request = nodemock.mock();
    this.session = {
      buildUrl: function(path) { return 'http://localhost' + path; },
      buildOptions: function(query, data) {
        return _.extend(
          { json: true },
          query ? { qs: query } : {},
          data ? { json: data } : {}
        );
      }
    };

    this.client = new HttpClient(this.session, { json: true }, this.request);
  });

  afterEach(function() {
    this.request.assertThrows();
  });

  describe('#get', function() {

    it('Issues a GET request', function(done) {
      this.request
        .mock('get')
        .takes('http://localhost/me', { json: true }, function(){})
        .calls(2, [null, { statusCode: 200 }, 'body']);

      this.client.get('/me', function(err, response) {
        if (err) return done(err);
        expect(response).to.be.an.instanceof(HttpResponse);
        expect(response.getResponseCode()).to.equal(200);
        expect(response.getBody()).to.equal('body');
        done();
      });
    });

    it('Optionally accepts query string params', function(done) {
      var query = { archived: true };

      this.request
        .mock('get')
        .takes('http://localhost/me', { json: true, qs: query }, function(){})
        .calls(2, [null, { statusCode: 200 }, 'body']);

      this.client.get('/me', query, function(err, response) {
        if (err) return done(err);
        expect(response).to.be.an.instanceof(HttpResponse);
        expect(response.getResponseCode()).to.equal(200);
        expect(response.getBody()).to.equal('body');
        done();
      });
    });

  });

  describe('#put', function() {

    it('Issues a PUT request', function(done) {
      var payload = { firstname: 'adrian' };

      this.request
        .mock('put')
        .takes('http://localhost/profile', { json: payload }, function(){})
        .calls(2, [null, { statusCode: 200 }, 'body']);

      this.client.put('/profile', payload, function(err, response) {
        if (err) return done(err);
        expect(response).to.be.an.instanceof(HttpResponse);
        expect(response.getResponseCode()).to.equal(200);
        expect(response.getBody()).to.equal('body');
        done();
      });
    });

  });

  describe('#post', function() {

    it('Issues a POST request', function(done) {
      var payload = { firstname: 'adrian' };

      this.request
        .mock('put')
        .takes('http://localhost/signup', { json: payload }, function(){})
        .calls(2, [null, { statusCode: 201 }, 'body']);

      this.client.put('/signup', payload, function(err, response) {
        if (err) return done(err);
        expect(response).to.be.an.instanceof(HttpResponse);
        expect(response.getResponseCode()).to.equal(201);
        expect(response.getBody()).to.equal('body');
        done();
      });
    });

  });

  describe('#del', function() {

    it('Issues a DELETE request', function(done) {
      this.request
        .mock('del')
        .takes('http://localhost/me', { json: true }, function(){})
        .calls(2, [null, { statusCode: 204 }]);

      this.client.del('/me', function(err, response) {
        if (err) return done(err);
        expect(response).to.be.an.instanceof(HttpResponse);
        expect(response.getResponseCode()).to.equal(204);
        done();
      });
    });

  });

});
