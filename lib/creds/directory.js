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
      console.log(data);
      console.log(data.response.devices);
      
      //if (err) { return cb(err); }
    
      /*
      var credential = {};
      credential.id = '0';
      credential.methods = [ 'otp' ];
    
      return cb(null, [ credential ]);
      */
    });
  });
};


module.exports = Directory;
