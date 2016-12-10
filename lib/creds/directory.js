var merge = require('utils-merge');


function Directory(client, idmap) {
  this._client = client;
  this._idmap = idmap;
}

Directory.prototype.list = function(user, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  var self = this;
  this._idmap(user, function(err, idparams) {
    if (err) { return cb(err); }
    
    var params = {};
    merge(params, idparams);
    
    self._client.jsonApiCall('POST', '/auth/v2/preauth', params, function(data) {
      if (data.stat !== 'OK') {
        return cb(new Error('TODO: something went wrong'));
      }
    
      var devices = data.response.devices, device;
      var credentials = [], credential;
      var i, len;
    
      for (i = 0, len = devices.length; i < len; ++i) {
        device = devices[i];
        credential = {};
        credential.id = device.device;
        credential.methods = [];
        if (device.capabilities.indexOf('mobile_otp') !== -1) {
          credential.methods.push('otp');
        }
        
        credentials.push(credential);
      }
      
      return cb(null, credentials);
    });
  });
};


module.exports = Directory;
