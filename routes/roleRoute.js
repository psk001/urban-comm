const express = require("express");
const router = express.Router();

const {
  validateCreateRole
}= require('../middlewares/payloadValidationMiddleware')

const {
  createRole,
  getAllRole,
} = require("../controllers/roleController")


router.get("/", getAllRole);

router.post("/", validateCreateRole, createRole);


module.exports = router;
