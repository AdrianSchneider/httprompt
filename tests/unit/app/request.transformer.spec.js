'use strict';

var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Config       = require('../../../src/config/config');
var Request      = require('../../../src/app/request');
var HttpResponse = require('../../../src/http/response');
var transformer  = require('../../../src/app/request.transformer');

describe('Request Transformer', function() {

  it('Transforms a Request into a Request', function() {
    var input = new Request('test');
    var output = transformer(input);
    expect(input.getLine()).to.equal(output.getLine());
  });

  it('Replaces $(input.x) variables from parent request', function() {
    var parent = new Request('login <username> <password>', { username: 'admin', password: 'letmein' });
    var child = new Request('POST /register { $(input.username), $(input.password) }');
    var output = transformer(child, parent);
    expect(output.getLine()).to.equal('POST /register { admin, letmein }');
  });

  it('Replaces $(response.x) variables from http responses', function() {
    var session = { getLastResponse: function() { return { getResponse: function() { return response; } }; } };
    var input = new Request('header set authorization $(response.body.token)');
    var response = new HttpResponse({ statusCode: 200 }, { token: 'abc' });
    var output = transformer(input, null, null, session);
    expect(output.getLine()).to.equal('header set authorization abc');
  });

  it('Replaces $(config.x) variables from config', function() {
    var config = new Config({ app: 'httprompt' });
    var input = new Request('headers stick user-agent $(config.app)');
    var output = transformer(input, null, config);
    expect(output.getLine()).to.equal('headers stick user-agent httprompt');
  });

  it('Replaces $(vars.x) variables from profile variables', function() {
    var vars = { username: 'admin' };
    var session = { getProfile: function() { return { getVariable: function(v) { return vars[v]; } }; } };
    var input = new Request('login $(vars.username)');
    var output = transformer(input, null, null, session);
    expect(output.getLine()).to.equal('login admin');
  });

  it('Fails if transformer namespace is invalid', function() {
    var input = new Request('what happens $(when.this.is.made.up)');
    var f = function() { transformer(input); };
    expect(f).to.throw(Error, 'invalid');
  });

});
