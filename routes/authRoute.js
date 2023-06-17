const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");

const {
  signinUser,
  signupUser,
  getSelf,
} = require("../controllers/authController");

router.post("/signup", signupUser);

router.post("/signin", signinUser);

router.get("/me", auth, getSelf);

module.exports = router;
