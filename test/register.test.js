/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/register');


describe('register', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('register', function() {
    var client = {
      jsonApiCall: function(){}
    };
    var idmap;
    
    
    describe('a typical authenticator', function() {
      var params;
      
      before(function() {
        var result = {
          response: {
            activation_barcode: 'https://api-x0xxxx00.duosecurity.com/frame/qr?value=duo%3A%2F%2F0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX',
            activation_code: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX',
            activation_url: 'https://m-x0xxxx00.duosecurity.com/activate/0x0xXx0XXXXxxXXX00xX',
            expiration: 1498931123,
            user_id: 'XXXXX00XXXXXX00XXX0X',
            username: '000xx0x00xx0x00000x00x00xx0x00x0'
          },
          stat: 'OK'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
        idmap = sinon.stub().yields(null, { username: 'johndoe' });
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var register = factory(idmap, client);
        
        register({ id: '1', username: 'johndoe' }, function(_err, _params) {
          if (_err) { return done(_err); }
          params = _params;
          done();
        });
      });
    
      it('should perform authentication via Auth API', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/enroll');
        //expect(call.args[2]).to.deep.equal({
        //  username: 'johndoe'
        //});
      });
      
      it('should yield parameters', function() {
        expect(params).to.be.an('object');
        expect(params).to.deep.equal({
          type: 'oob',
          barcodeURL: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX',
          context: {
            user_id: 'XXXXX00XXXXXX00XXX0X',
            activation_code: 'duo://0x0xXx0XXXXxxXXX00xX-XXXxXXXxXxXxXXX0XxX0x0XxX0XxxXX0XxXxxX'
          }
        });
      });
    }); // a typical authenticator
    
    
    describe('failure caused by bad request, wrong integration type', function() {
      var err, params;
      
      before(function() {
        var result = {
          code: 40301,
          message: 'Access forbidden',
          message_detail: 'Wrong integration type for this API.',
          stat: 'FAIL'
        };
        
        sinon.stub(client, 'jsonApiCall').yields(result);
        idmap = sinon.stub().yields(null, { username: 'johndoe' });
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var register = factory(idmap, client);
        
        register({ id: '1', username: 'johndoe' }, function(_err, _params) {
          err = _err;
          params = _params;
          done();
        });
      });
    
      it('should call client#jsonApiCall', function() {
        expect(client.jsonApiCall).to.have.been.calledOnce;
        var call = client.jsonApiCall.getCall(0);
        expect(call.args[0]).to.equal('POST');
        expect(call.args[1]).to.equal('/auth/v2/enroll');
        //expect(call.args[2]).to.deep.equal({ username: 'johndoe' });
      });
      
      it('should yield error', function() {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Access forbidden');
        expect(err.code).to.equal(40301);
        expect(err.messageDetail).to.equal('Wrong integration type for this API.');
      });
    }); // failure caused by bad request, missing required parameters
    
  });
  
});
