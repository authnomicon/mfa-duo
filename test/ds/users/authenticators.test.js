/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/ds/users/authenticators');


describe('duo/ds/credentials', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/CredentialDirectory');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/duo/CredentialDirectory');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('Directory', function() {
    var directory;
    
    var client = {
      jsonApiCall: function(){}
    };
    var idmap;
    
    
    describe('#list', function() {
    
      describe('user with app installed on iPhone', function() {
        var credentials;
        
        before(function() {
          var record = {
            response: {
              devices: [{
                capabilities: ['push', 'sms', 'phone', 'mobile_otp'],
                device: 'XXXXXXXXXXX000X0XXXX',
                display_name: 'iOS (XXX-XXX-1234)',
                name: '',
                number: '888-555-1234',
                sms_nextcode: '2',
                type: 'phone'
              }],
              result: 'auth',
              status_msg: 'Account is active'
            },
            stat: 'OK'
          };
          
          sinon.stub(client, 'jsonApiCall').yields(record);
          idmap = sinon.stub().yields(null, { username: 'johndoe' });
        });
      
        after(function() {
          client.jsonApiCall.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _credentials) {
            if (_err) { return done(_err); }
            credentials = _credentials;
            done();
          });
        });
      
        it('should call id.map', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should call client#jsonApiCall', function() {
          expect(client.jsonApiCall).to.have.been.calledOnce;
          var call = client.jsonApiCall.getCall(0);
          expect(call.args[0]).to.equal('POST');
          expect(call.args[1]).to.equal('/auth/v2/preauth');
          expect(call.args[2]).to.deep.equal({
            username: 'johndoe'
          });
        });
        
        it('should yield credentials', function() {
          expect(credentials).to.be.an('array');
          expect(credentials).to.have.length(1);
          expect(credentials[0]).to.deep.equal({
            id: 'XXXXXXXXXXX000X0XXXX',
            methods: [ 'otp' ]
          });
        });
        
      }); // user with app installed on iPhone
      
    }); // #list
    
  }); // Directory
  
});
