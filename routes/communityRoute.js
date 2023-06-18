const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");

const {
  validateCreateCommunity
}= require('../middlewares/payloadValidationMiddleware')

const {
  createCommunity,
  getAllCommunity,
  getAllCommunityMembers,
  getOwnedCommunity,
  getJoinedCommunity,
} = require("../controllers/communityController");

router.get("/", getAllCommunity);

router.get("/:id/members", getAllCommunityMembers);

router.get("/me/owner", auth, getOwnedCommunity);

router.get("/me/member", auth, getJoinedCommunity);

router.post("/", [auth, validateCreateCommunity],  createCommunity);

module.exports = router;
