exports = module.exports = function() {
  
  return function username(user, cb) {
    //return cb(null, { username: 'johndoe'});
    return cb(null, { username: '1425693a6365bd9c7ab4bea59f57792f' });
    return cb(null, { username: user.username });
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
