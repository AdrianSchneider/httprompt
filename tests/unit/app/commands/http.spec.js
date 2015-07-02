'use strict';

var _            = require('underscore');
var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Request      = require('../../../../src/app/request');
var httpCommands = require('../../../../src/app/commands/http');

describe('HTTP Commands', function() {

  beforeEach(function() {
    this.client = nodemock.mock();
    this.commands = httpCommands(this.client);
    this.getCommand = function(search) {
      return this.commands.filter(function(command) {
        return command.getHelp().indexOf(search) === 0;
      })[0];
    };
  });

  describe('GET <path>', function() {

    it('Issues a GET request', function(done) {
      this.command = this.getCommand('GET');
      var request = new Request('get /me');

      this.client
        .mock('get')
        .takes('/me', {}, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

  });

  describe('POST <path> <payload>', function() {

    beforeEach(function() {
      this.command = this.getCommand('POST');
    });

    it('Issues a POST request', function(done) {
      var request = new Request('post /register');

      this.client
        .mock('post')
        .takes('/register', {}, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

    it('Includes valid JSON', function(done) {
      var request = new Request('post /register { "name": "cool" }');

      this.client
        .mock('post')
        .takes('/register', { name: "cool" }, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

    it('Replaces invalid JSON with a null', function(done) {
      var request = new Request('post /register {als"djfalsdkjf"}');

      this.client
        .mock('post')
        .takes('/register', null, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

  });

  describe('PUT <path> <payload>', function() {

    beforeEach(function() {
      this.command = this.getCommand('PUT');
    });

    it('Issues a POST request', function(done) {
      var request = new Request('put /me');

      this.client
        .mock('put')
        .takes('/me', {}, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

    it('Includes valid JSON', function(done) {
      var request = new Request('put /me { "name": "cool" }');

      this.client
        .mock('put')
        .takes('/me', { name: "cool" }, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

    it('Replaces invalid JSON with a null', function(done) {
      var request = new Request('put /me {als"djfalsdkjf"}');

      this.client
        .mock('put')
        .takes('/me', null, function(){})
        .calls(2, [null, 'response']);

      this.command.process(request, function(err, out) {
        expect(out).to.equal('response');
        done(err);
      });
    });

  });

  describe('DELETE <path>', function() {

    it('Issues a DELETE request', function(done) {
      this.command = this.getCommand('DELETE');
      var request = new Request('delete /users/5');

      this.client
        .mock('delete')
        .takes('/users/5', function(){})
        .calls(1, [null]);

      this.command.process(request, done);
    });

  });

});
