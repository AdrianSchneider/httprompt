'use strict';

var expect       = require('chai').expect;
var nodemock     = require('nodemock');
var Renderer     = require('../../../src/ui/renderer');
var HttpResponse = require('../../../src/http/response');

describe('Renderer', function() {

  beforeEach(function() {
    this.config = (function() {
      var conf = { "external": "console", "external.json": "external" };
      return { get: function(key){ return conf[key] || null; } };
    })();
    this.console = nodemock.mock();
    this.external = nodemock.mock();
    this.renderer = new Renderer(this.config, { console: this.console, external: this.external });
  });

  afterEach(function() {
    this.console.assertThrows();
    this.external.assertThrows();
  });

  describe('#render', function() {

    it('Delegates rendering to the requested renderer', function(done) {
      var data = { name: 'sup' };

      this.console
        .mock('renderResponse')
        .takes(data, function(){})
        .calls(1, []);

      this.renderer.render('console', data, done);
    });

    it('Fails when the renderer is not valid', function(done) {
      this.renderer.render('made up', {}, function(err) {
        expect(err.message).to.contain('made up');
        done();
      });

    });

  });

  describe('#renderExternal', function() {

    it('Uses external.json for json responses', function(done) {
      var data = { name: 'sup' };
      var response = new HttpResponse({ headers: { 'content-type': 'application/json' }}, data);

      this.external
        .mock('renderResponse')
        .takes(response, function(){})
        .calls(1, []);

      this.renderer.renderExternal(response, done);
    });

    it('Falls back to external for everything else', function(done) {
      var data = { name: 'sup' };
      var response = new HttpResponse({ headers: { 'content-type': 'xml' }}, data);

      this.console
        .mock('renderResponse')
        .takes(response, function(){})
        .calls(1, []);

      this.renderer.renderExternal(response, done);
    });

  });

});
