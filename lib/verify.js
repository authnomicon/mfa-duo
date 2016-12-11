var DuoAuthAPIError = require('./errors/duoauthapierror');


exports = module.exports = function(client) {
  
  return function verify(user, credID, txid, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    var params = {};
    params.txid = txid;
    
    client.jsonApiCall('GET', '/auth/v2/auth_status', params, function(data) {
      if (data.stat !== 'OK') {
        return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
      }
      
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
