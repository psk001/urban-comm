const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");

const {
  createRole,
  getAllRole,
} = require("../controllers/roleController")


router.get("/", getAllRole);

router.post("/", createRole);


module.exports = router;
