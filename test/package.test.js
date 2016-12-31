/* global describe, it */

var expect = require('chai').expect;
var pkg = require('..');


describe('nodex-login-mfa-duo', function() {
  
  it('should export manifest', function() {
    expect(pkg).to.be.an('object');
    expect(pkg['client']).to.be.a('function');
    expect(pkg['ds/users/authenticators']).to.be.a('function');
  });
  
  describe('client', function() {
    var client = pkg['client'];
    
    it('should be annotated', function() {
      expect(client['@implements']).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client');
      expect(client['@singleton']).to.equal(true);
    });
  });
  
  describe('ds/users/authenticators', function() {
    var rsg = pkg['ds/users/authenticators'];
    
    it('should be annotated', function() {
      expect(rsg['@implements']).to.have.length(2);
      expect(rsg['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/UserAuthenticatorsDirectory');
      expect(rsg['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/duo/UserAuthenticatorsDirectory');
      expect(rsg['@singleton']).to.equal(true);
    });
  });
  
});
