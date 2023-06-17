const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_KEY;

const { Success, Error } = require("../utils/response")

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    const responseObject= {
      "errors": [
        {
          "message": "You need to sign in to proceed.",
          "code": "NOT_SIGNEDIN"
        }
      ]
    }

    res.status(401).send(new Error(responseObject));
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    res.status(401).send(new Error("Please authenticate using a valid token"));
  }
};

module.exports = { auth };
