var qs = require('qs');
var merge = require('utils-merge');
var DuoAuthAPIError = require('../lib/errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function confirm(options, cb) {
    console.log('REGISTER DUO...');
    
    var params = {};
    // marshalled between associate and bind operations as context
    params.user_id = options.user_id;
    params.activation_code = options.activation_code;
    
    client.jsonApiCall('POST', '/auth/v2/enroll_status', params, function(data) {
      console.log('ENROLL STATUS RESPONSE');
      console.log(data);
      
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
      
      switch (data.response) {
      case 'waiting':
        return cb(null, undefined);
      case 'success':
        return cb(null, true);
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
  'http://schemas.authnomicon.org/js/login/mfa/bind',
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/bind'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
