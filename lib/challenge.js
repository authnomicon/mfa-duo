var merge = require('utils-merge');
var DuoAuthAPIError = require('./errors/duoauthapierror');


exports = module.exports = function(client, idmap) {
  
  return function challenge(user, credID, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    var type = options.type || 'oob';
    
    idmap(user, function(err, idparams) {
      if (err) { return cb(err); }
      
      var params = {};
      merge(params, idparams);
      params.device = credID;
      
      
      switch (type) {
        case 'oob': {
          params.async = '1';
          
          switch (options.transport) {
          case undefined:
            params.factor = 'auto';
          }
        }
        case 'otp': {
          // TODO
        }
      }
      
    
      client.jsonApiCall('POST', '/auth/v2/auth', params, function(data) {
        if (data.stat !== 'OK') {
          return cb(new DuoAuthAPIError(data.message, data.code, data.message_detail));
        }
        
        return cb(null, { type: 'oob', txid: data.response.txid });
      });
    });
  };
};
