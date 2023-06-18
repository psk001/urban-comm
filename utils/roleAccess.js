const { COMMUNITY_ADMIN, COMMUNITY_MODERATOR, getRole } = require("./roles");

const checkAddMember = async (community, user) => {
  const role = await getRole(user, community);

  if (role !== COMMUNITY_ADMIN) {
    return false;
  }

  return true;
};

const checkDeleteMember = async (community, user) => {
  const role = await getRole(user, community);

  if (role !== COMMUNITY_ADMIN || role !== COMMUNITY_MODERATOR) {
    return false;
  }

  true;
};

module.exports = {
  checkAddMember,
  checkDeleteMember,
};
