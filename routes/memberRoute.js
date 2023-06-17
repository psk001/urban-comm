const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");

const {
  addMember,
  removeMember,
} = require("../controllers/memberController")


router.get("/", auth, addMember);

router.post("/:id", auth, removeMember);


module.exports = router;
