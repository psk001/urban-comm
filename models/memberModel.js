const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  community: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});


const Member = mongoose.model("Member", memberSchema);

module.exports.Member = Member;
