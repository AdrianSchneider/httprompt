'use strict';

var assert     = require('assert');
var nodemock   = require('nodemock');
var HttpClient = require('../../../src/http/client');

describe.skip('HttpClient', function() {

  before(function() {
    this.defaultProfile = {
      buildUrl: function(url) {
        return url;
      }
    };
  });

  describe('#get', function() {

    beforeEach(function() {
      this.request = nodemock.mock();
      this.client = new HttpClient(this.request, this.defaultProfile);
    });
    afterEach(function() {
      this.request.assertThrows();
    });

    it('Passes a request to get', function(done) {
      this.request
        .mock('get')
        .takes('/a', {}, function(){})
        .calls(2, [null, null, '{body}']);

      this.client.get('/a', function(err, res, body) {
        assert.equal(body, '{body}');
        done();
      });
    });

    it('Supports optional query params', function(done) {
      var query = { search: 'free stuff' };
      this.request
        .mock('get')
        .takes('/a', { query: query }, function(){})
        .calls(2, [null, null, '{body}']);

      this.client.get('/a', query,function(err, res, body) {
        assert.equal(body, '{body}');
        done();
      });
    });

  });

});
