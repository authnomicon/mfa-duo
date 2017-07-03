var qs = require('qs');
var merge = require('utils-merge');
var DuoAuthAPIError = require('../lib/errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function register(cb) {
    console.log('REGISTER DUO...');
    
    var params = {};
    // NOTE: Error if username already exists
    //params.username = 'enrollme';
    
    client.jsonApiCall('POST', '/auth/v2/enroll', params, function(data) {
      console.log('ENROLL RESPONSE');
      console.log(data);
      
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
      
      /*
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
      
      console.log('CHALLENGE DUO');
      console.log(data);
      
      return cb(null, { type: 'oob', transactionID: data.response.txid });
      */
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/associate',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/associate'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
