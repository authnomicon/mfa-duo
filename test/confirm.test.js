/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../lib/confirm');


describe('confirm', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('confirm', function() {
    var client = {
      jsonApiCall: function(){}
    };
    
    
    describe('confirmed', function() {
      var params;
      
      before(function() {
        var result = { response: 'success', stat: 'OK' };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var confirm = factory(client);
        
        confirm({ userID: 'XXXXX00XXXXXX00XXX0X', code: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX' }, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/enroll_status');
        expect(call.args[2]).to.deep.equal({
          user_id: 'XXXXX00XXXXXX00XXX0X',
          activation_code: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX'
        });
      });
      
      it('should yield parameters', function() {
        expect(params).to.equal(true);
      });
    }); // confirmed
    
    describe('a typical authenticator', function() {
      var params;
      
      before(function() {
        var result = { response: 'waiting', stat: 'OK' };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var confirm = factory(client);
        
        confirm({ userID: 'XXXXX00XXXXXX00XXX0X', code: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX' }, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/enroll_status');
        expect(call.args[2]).to.deep.equal({
          user_id: 'XXXXX00XXXXXX00XXX0X',
          activation_code: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX'
        });
      });
      
      it('should yield parameters', function() {
        expect(params).to.equal(false);
      });
    }); // a typical authenticator
    
  });
  
});
