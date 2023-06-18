const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");

const {
  addMember,
  removeMember,
} = require("../controllers/memberController")


router.post("/", auth, addMember);

router.delete("/:id", auth, removeMember);

module.exports = router;
