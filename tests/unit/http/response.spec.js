'use strict';

var expect = require('chai').expect;
var HttpResponse = require('../../../src/http/response');

describe('Http Response', function() {

  before(function() {
    this.response = new HttpResponse(
      {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        request: {
          method: 'GET',
          headers: {
            'User-Agent': 'test'
          },
          uri: { 
            path: '/me'
          }
        }
      },
      { name: 'Joe' }
    );
  });

  describe('#getResponseCode', function() {
    it('Returns the response code', function() {
      expect(this.response.getResponseCode()).to.equal(200);
    });
  });

  describe('#getHeaders', function() {
    it('Returns the headers as an object', function() {
      expect(this.response.getHeaders()).to.deep.equal({ 'Content-Type': 'application/json' });
    });
  });

  describe('#getBody', function() {
    it('Returns the body', function() {
      expect(this.response.getBody()).to.deep.equal({ name: 'Joe' });
    });
  });

  describe('#serialize', function() {

    it('Dumps the request headers, the response headers, and then the body', function() {
      expect(this.response.serialize()).to.equal([
        'GET /me',
        'User-Agent: test',
        '',
        '200 OK',
        'Content-Type: application/json',
        '',
        '{',
        '  "name": "Joe"',
        '}',
        '',
        ''
      ].join('\n'));
    });

  });

});
