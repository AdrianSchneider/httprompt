'use strict';

var expect = require('chai').expect;
var expand = require('../../../src/utils/expander');

describe('Variable Expander', function() {

  it('Expands input values', function() {
    var line = 'login $(input.username) $(input.password)';
    var input = { username: 'adrian', password: 'letmein' };
    expect(expand(line, input)).to.equal('login adrian letmein');
  });

  it('Expands config values');
  it('Expands response values');
  it('Expands response values recursively');

});
