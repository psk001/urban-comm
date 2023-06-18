const payloadErrorMessageList = {
  name: {
    param: "name",
    message: "Name should be at least 2 characters.",
    code: "INVALID_INPUT",
  },
  email: {
    param: "email",
    message: "Please provide a valid email address.",
    code: "INVALID_INPUT",
  },
  password: {
    param: "password",
    message: "Password should be at least 6 characters.",
    code: "INVALID_INPUT",
  },
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateResourceNotFoundErrorObject(params) {
  return {
    params,
    message: `${capitalizeFirstLetter(params)} not found.`,
    code: "RESOURCE_NOT_FOUND",
  };
}


function generateResourceNotAllowedErrorObject() {
  return {
    message: 'You are not authorized to perform this action.',
    code: "NOT_ALLOWED_ACCESS",
  };
}

function generateGeneralErrorObject(message, code, params){
  return {
    message,
    code,
    params
  }
}


module.exports = {
  payloadErrorMessageList,

  generateGeneralErrorObject,
  generateResourceNotFoundErrorObject,
  generateResourceNotAllowedErrorObject
};
