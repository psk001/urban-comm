const { Error } = require("../utils/response");

const {
  COMMUNITY_ADMIN,
  COMMUNITY_MODERATOR,
  getRole
}= require('../utils/roles');


const checkAddMember = async (req, res, next) => {
  const { community } = req.body;
  const {id: user} = req.user;

  console.log('user: ', user, 'community: ', community)
  const role = await getRole(user, community);

  console.log('role name: ', role, 'data: ', COMMUNITY_ADMIN)

  if (role !== COMMUNITY_ADMIN) {
    return res
      .status(401)
      .send(
        new Error(
          "You are not authorized to perform this action.",
          "NOT_ALLOWED_ACCESS"
        )
      );
  }

  next();
};

const checkDeleteMember = async (req, res, next) => {
  const { community } = req.body;
  const {id: user} = req.user;

  console.log('user: ', user, 'community: ', community)
  const role = await getRole(user, community);
  console.log('role name: ', role, 'data: ', COMMUNITY_ADMIN)

  if (role !== COMMUNITY_ADMIN || role !== COMMUNITY_MODERATOR) {
    return res
      .status(401)
      .send(
        new Error(
          "You are not authorized to perform this action.",
          "NOT_ALLOWED_ACCESS"
        )
      );
  }

  next();
};

module.exports= {
    checkAddMember,
    checkDeleteMember
}
