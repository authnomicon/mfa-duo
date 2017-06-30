/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../lib/register');


describe('register', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('challenge', function() {
    var client = {
      jsonApiCall: function(){}
    };
    
    
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
      });
    
      after(function() {
        client.jsonApiCall.restore();
      });
      
      before(function(done) {
        var register = factory(client);
        
        register(function(_err, _params) {
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
        expect(call.args[2]).to.deep.equal({});
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
