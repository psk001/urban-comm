const { payloadErrorMessageList } = require("../utils/errorMessages");

const getErrorBody = (errorFields) => {
  const errors = [];

  for (let field of errorFields) {
    errors.push(payloadErrorMessageList[`${field}`]);
  }

  return errors;
};

const validateSignUpUser = (req, res, next) => {
  const errorFields = [];
  const { name, email, password } = req.body;

  if (name === null || name === "" || name.length < 2) {
    errorFields.push("name");
  }

  if (email === null || email === "") {
    errorFields.push("email");
  }

  if (password === null || password === "" || password.length < 6) {
    errorFields.push("password");
  }

  if (errorFields.length !== 0) {
    const errors = getErrorBody(errorFields);
    const respData = {
      status: false,
      errors,
    };
    return res.status(400).send(respData);
  }

  next();
};

const validateSignInUser = (req, res, next) => {
  const errorFields = [];
  const { email } = req.body;

  if (email === null || email === "") {
    errorFields.push("email");
  }

  if (errorFields.length !== 0) {
    const errors = getErrorBody(errorFields);
    const respData = {
      status: false,
      errors,
    };
    return res.status(400).send(respData);
  }

  next();
};

const validateCreateRole = (req, res, next) => {
  const errorFields = [];
  const { name } = req.body;

  if (name === null || name.length < 2) {
    errorFields.push("name");
  }

  if (errorFields.length !== 0) {
    const errors = getErrorBody(errorFields);
    const respData = {
      status: false,
      errors,
    };
    return res.status(400).send(respData);
  }

  next();
};

const validateCreateCommunity = (req, res, next) => {
  const errorFields = [];
  const { name } = req.body;

  if (name === null || name.length < 2) {
    errorFields.push("name");
  }

  if (errorFields.length !== 0) {
    const errors = getErrorBody(errorFields);
    const respData = {
      status: false,
      errors,
    };
    return res.status(400).send(respData);
  }

  next();
};

module.exports = {
  validateSignUpUser,
  validateSignInUser,
  validateCreateRole,
  validateCreateCommunity,
};
