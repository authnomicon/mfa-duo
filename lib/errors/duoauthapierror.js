function DuoAuthAPIError(message, code, detail) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DuoAuthAPIError';
  this.message = message;
  this.messageDetail = detail;
  this.code = code;
  this.status = 500;
}

// Inherit from `Error`.
DuoAuthAPIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = DuoAuthAPIError;