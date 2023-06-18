const { Member } = require("../models/memberModel");
const { Role } = require("../models/roleModel");

const COMMUNITY_ADMIN = "Community Admin";
const COMMUNITY_MODERATOR = "Community Moderator";

async function getRole(user, community) {
  const {role: roleId} = await Member.findOne({ user: user, community: community })
    .select("role")
    .lean();

  console.log('role data', roleId);

  const {name} = await Role.findOne({ id: roleId }).select("name").lean();

  return name;
}

module.exports = {
  COMMUNITY_ADMIN,
  COMMUNITY_MODERATOR,
  getRole
};
