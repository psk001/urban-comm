class Success {
  constructor(content) {
    this.status = true;
    this.content = content;
  }
}

class Error {
  constructor(content) {
    this.status = false;
    this.content = content;
  }
}

module.exports = {
  Error,
  Success,
};
