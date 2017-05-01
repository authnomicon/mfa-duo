/*
exports = module.exports = {
  'client': require('./client'),
  'challenge': require('./challenge'),
  'lookup/verify': require('./lookup/verify'),
  'otp/verify': require('./otp/verify'),
  'oob/verify': require('./oob/verify'),
  'ds/users/authenticators': require('./ds/users/authenticators'),
  'id/map': require('./id/map')
};
*/

exports = module.exports = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
