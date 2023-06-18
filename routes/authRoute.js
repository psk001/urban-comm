const express = require("express");
const router = express.Router();
const { 
  auth
 } = require("../middlewares/authMiddleware");

const {
  validateSignUpUser,
  validateSignInUser
}= require('../middlewares/payloadValidationMiddleware')

const {
  signinUser,
  signupUser,
  getSelf,
} = require("../controllers/authController");

router.post("/signup", validateSignUpUser, signupUser);

router.post("/signin", validateSignInUser, signinUser);

router.get("/me", auth, getSelf);

module.exports = router;
