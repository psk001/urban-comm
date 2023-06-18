class Success {
  constructor(content) {
    this.status = true;
    this.content = content;
  }
}

class Error {
  constructor(errors) {
    this.status = false
    this.errors= errors
  }
}

module.exports = {
  Error,
  Success,
};
