exports = module.exports = function() {
  
  return function username(user, cb) {
    //return cb(null, { username: 'johndoe'});
    
    return cb(null, { username: user.username });
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
