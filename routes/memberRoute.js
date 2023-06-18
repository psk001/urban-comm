const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const {
  checkAddMember,
  checkDeleteMember
}= require('../middlewares/roleMiddleware');

const {
  addMember,
  removeMember,
} = require("../controllers/memberController")


router.post("/", [auth, checkAddMember], addMember);

router.delete("/:id", auth, removeMember);


module.exports = router;
