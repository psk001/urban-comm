class Success {
  constructor(content) {
    this.status = true;
    this.content = content;
  }
}

class Error {
  constructor(message, code, params) {
    this.status = false
    this.errors= {
      'params': params,
      'message': message,
      'code': code
    }
  }
}

module.exports = {
  Error,
  Success,
};
