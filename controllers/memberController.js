const { Snowflake } = require("@theinternetfolks/snowflake");

const { Community } = require("../models/communityModel");
const { Role } = require("../models/roleModel");
const { Member } = require("../models/memberModel");
const { User } = require("../models/userModel");
const { Success, Error } = require("../utils/response");

const { checkAddMember, checkDeleteMember } = require("../utils/roleAccess");

const {
  generateGeneralErrorObject,
  generateResourceNotFoundErrorObject,
  generateResourceNotAllowedErrorObject,
} = require("../utils/errorMessages");

// utility function to check if given parameters are valid values
// that is they exist in respective collections
async function checkObjectPresence(communityId, roleId, userId) {
  const errors = [];

  const communityObj = await Community.findOne({ id: communityId }).lean();
  if (!communityObj) {
    errors.push(generateResourceNotFoundErrorObject("community"));
  }

  const roleObj = await Role.findOne({ id: roleId }).lean();
  if (!roleObj) {
    errors.push(generateResourceNotFoundErrorObject("role"));
  }

  const userObj = await User.findOne({ id: userId }).lean();
  if (!userObj) {
    errors.push(generateResourceNotFoundErrorObject("user"));
  }

  if (errors.length !== 0) {
    return { status: true, errors };
  }

  return { status: false };
}

async function addMember(req, res) {
  try {
    const { id: authUser } = req.user;
    const { community, role, user } = req.body;

    const presenceResp = await checkObjectPresence(community, role, user);

    if (presenceResp.status) {
      const { errors } = presenceResp;
      return res.status(400).send(new Error(errors));
    }

    const addMemberFlag = await checkAddMember(community, authUser);

    if (!addMemberFlag) {
      const errors = generateResourceNotAllowedErrorObject();
      return res.status(401).send(new Error(errors));
    }

    let member = await Member.findOne({
      user,
      community,
    }).lean();

    if (member) {
      const error = [
        generateGeneralErrorObject(
          "User already present in community",
          "RESOURCE_EXISTS"
        ),
      ];
      return res.status(400).send(new Error(error));
    }

    member = new Member({
      id: Snowflake.generate(),
      user,
      community,
      role,
    });

    await member.save();

    const { id, created_at, updated_at } = member;

    const memberResponseObject = {
      data: {
        id,
        community,
        user,
        role,
        created_at,
        updated_at,
      },
    };

    return res.send(new Success(memberResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not create member"));
  }
}

async function removeMember(req, res) {
  const { id: user } = req.user;
  try {
    const memberId = req.params.id;

    const member = await Member.findOne({ id: memberId }).lean();

    if (!member) {
      const errors = [
        generateGeneralErrorObject("Member not found.", "RESOURCE_NOT_FOUND"),
      ];
      return res.send(new Error(errors));
    }

    const communityId = member.community;

    const deleteMemberFlag = checkDeleteMember(communityId, user);

    if (!deleteMemberFlag) {
      const errors = [generateResourceNotAllowedErrorObject()];
      return res.status(401).send(new Error(errors));
    }

    await Member.findOneAndRemove({ id: memberId });
    return res.send(new Success());
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not remove member"));
  }
}

module.exports = {
  addMember,
  removeMember,
};
