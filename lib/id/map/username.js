exports = module.exports = function() {
  
  return function username(user, cb) {
    //return cb(null, { username: 'johndoe'});
    return cb(null, { username: '961cb8d93cd9c41725f84c96aa6d65d0' });
    return cb(null, { username: user.username });
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
