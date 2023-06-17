const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");

const {
  createCommunity,
  getAllCommunity,
  getAllCommunityMembers,
  getOwnedCommunity,
  getJoinedCommunity,
} = require("../controllers/communityController");

router.get("/", getAllCommunity);

router.get("/:id/members", auth, getAllCommunityMembers);

router.get("/me/owner", auth, getOwnedCommunity);

router.get("/me/member", auth, getJoinedCommunity);

router.post("/", auth, createCommunity);

module.exports = router;
