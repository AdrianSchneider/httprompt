'use strict';

var expect          = require('chai').expect;
var nodemock        = require('nodemock');
var HistoryCommands = require('../../../../src/ui/commands/history');

describe.skip('History Commands', function() {

  beforeEach(function() {
    this.client = nodemock.mock();
    this.command = new HistoryCommands(this.client);
  });

  afterEach(function() {
    this.client.assertThrows();
  });

  describe('Matching', function() {

    it('Matches supported HTTP methods', function() {
      expect(this.command.match('open')).to.equal(true);
    });
  });

  describe('Processing', function() {

    describe('GET', function() {

      it('GETs the URL requested', function(done) {
        var url = '/';
        var response = { statusCode: 200 };
        var payload = { "a": "b" };

        this.client
          .mock('get')
          .takes(url, {}, function(){})
          .calls(2, [null, response, payload]);

        this.command.process('GET /', function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          expect(body).to.deep.equal({ a: 'b' });
          done();
        });
      });

    });

    describe('POST', function() {

      it('POSTs to the URL specified', function(done) {
        var url = '/users';
        var response = { statusCode: 201 };
        var responseBody = { id: 5 };

        this.client
          .mock('post')
          .takes(url, null, function(){})
          .calls(2, [null, response, responseBody]);

        this.command.process('POST /users', function(err, res, body) {
          expect(res.statusCode).to.equal(201);
          expect(body).to.deep.equal({ id: 5 });
          done();
        });
      });

      it('Parses JSON and includes it in the body if valid', function(done) {
        var url = '/users';
        var response = { statusCode: 201 };
        var responseBody = { id: 5 };

        this.client
          .mock('post')
          .takes(url, { username: "adrian" }, function(){})
          .calls(2, [null, response, responseBody]);

        this.command.process('POST /users { "username": "adrian" }', function(err, res, body) {
          expect(res.statusCode).to.equal(201);
          expect(body).to.deep.equal({ id: 5 });
          done();
        });

      });

    });

    describe('PUT', function() {

      it('PUTs to the URL specified', function(done) {
        var url = '/users/1';
        var response = { statusCode: 200 };
        var responseBody = { id: 5 };

        this.client
          .mock('put')
          .takes(url, null, function(){})
          .calls(2, [null, response, responseBody]);

        this.command.process('PUT /users/1', function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          expect(body).to.deep.equal({ id: 5 });
          done();
        });
      });

      it('Parses JSON and includes it in the body if valid', function(done) {
        var url = '/users/1';
        var response = { statusCode: 200 };
        var responseBody = { id: 5 };

        this.client
          .mock('put')
          .takes(url, { "username": "new one" }, function(){})
          .calls(2, [null, response, responseBody]);

        this.command.process('PUT /users/1 { "username": "new one" }', function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          expect(body).to.deep.equal({ id: 5 });
          done();
        });
      });

    });

    describe('DELETE', function() {

      it('DELETEs to the URL requested', function(done) {
        var url = '/users/1';
        var response = { statusCode: 204 };
        var responseBody = null;

        this.client
          .mock('delete')
          .takes(url, function(){})
          .calls(1, [null, response, responseBody]);

        this.command.process('DELETE /users/1', function(err, res, body) {
          expect(res.statusCode).to.equal(204);
          expect(body).to.deep.equal(null);
          done();
        });
      });

    });

  });

});
