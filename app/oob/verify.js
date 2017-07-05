var DuoAuthAPIError = require('../../lib/errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function verify(authenticator, transactionID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    var params = {};
    params.txid = transactionID;
    
    client.jsonApiCall('GET', '/auth/v2/auth_status', params, function(data) {
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
      
      console.log('VERIFY DUO');
      console.log(data);
      
      switch (data.response.result) {
      case 'waiting':
        return cb(null, undefined);
        break;
      case 'deny':
        return cb(null, false);
        break;
      case 'allow':
        return cb(null, true);
        break;
      }
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/duo/Client'
];
