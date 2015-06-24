'use strict';

var expect   = require('chai').expect;
var renderer = require('../../../src/ui/renderer');

describe('Renderer', function() {

  it('Returns the renderer by its name if it exists', function() {
    var r = renderer('console');
    expect(r.renderResponse).to.be.a('function');
  });

  it('Throws an error when the name does not exist', function() {
    var f = function() { renderer('made up'); };
    expect(f).to.throw(Error, 'does not exist');
  });

});
