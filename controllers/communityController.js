const { Snowflake } = require("@theinternetfolks/snowflake");

const { User } = require("../models/userModel");
const { Community } = require("../models/communityModel");
const { Member } = require("../models/memberModel");
const { Success, Error } = require("../utils/response");
const { Role } = require("../models/roleModel");

async function getAllCommunity(req, res) {
  try {
    const pageSize = process.env.PAGE_SIZE;
    const pageNumber = parseInt(req.query["page"]) || 1;

    const totalCommunityCount = await Community.countDocuments();

    const skipDocuments = (pageNumber - 1) * pageSize;

    const community = await Community.find()
      .skip(skipDocuments)
      .limit(pageSize)
      .select("-_id -__v")
      .lean();

    for (let i = 0; i < community.length; i++) {
      let element = { ...community[i] };

      const id = element.owner;
      delete element["owner"];

      const { name } = await User.findOne({ id: id }).select("name").lean();

      element.owner = {
        id,
        name,
      };

      community[i] = element;
    }

    const roleResponseObject = {
      meta: {
        total: totalCommunityCount,
        pages: Math.ceil(totalCommunityCount / pageSize),
        page: pageNumber,
      },
      data: community,
    };

    return res.send(new Success(roleResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not get community"));
  }
}

async function getAllCommunityMembers(req, res) {
  try {
    const communityId = req.params.id;

    const pageSize = process.env.PAGE_SIZE;
    const pageNumber = parseInt(req.query["page"]) || 1;

    const totalMemberCount = await Member.countDocuments({ community: communityId });

    const skipDocuments = (pageNumber - 1) * pageSize;

    const communityMembers = await Member.find({ community: communityId })
      .skip(skipDocuments)
      .limit(pageSize)
      .select("-_id -__v")
      .lean();

    for (let i = 0; i < communityMembers.length; i++) {
      let element = { ...communityMembers[i] };

      const userId = element.user;
      delete element["user"];

      const { name: userName } = await User.findOne({ id: userId })
        .select("name")
        .lean();

      element.user = {
        id: userId,
        name: userName,
      };

      const roleId = element.role;
      delete element["role"];

      const { name: roleName } = await Role.findOne({ id: roleId })
        .select("name")
        .lean();

      element.role = {
        id: roleId,
        name: roleName,
      };

      communityMembers[i] = element;
    }

    const memberResponseObject = {
      meta: {
        total: totalMemberCount,
        pages: Math.ceil(totalMemberCount / pageSize),
        page: pageNumber,
      },
      data: communityMembers,
    };

    return res.send(new Success(memberResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not community members"));
  }
}

async function getOwnedCommunity(req, res) {
  const { id: userId } = req.user;

  try {
    const pageSize = process.env.PAGE_SIZE;
    const pageNumber = parseInt(req.query["page"]) || 1;

    const totalCommunityCount = await Community.countDocuments({owner: userId});

    const skipDocuments = (pageNumber - 1) * pageSize;

    const community = await Community.find({ owner: userId })
      .skip(skipDocuments)
      .limit(pageSize)
      .select("-_id -__v")
      .lean();

    const roleResponseObject = {
      meta: {
        total: totalCommunityCount,
        pages: Math.ceil(totalCommunityCount / pageSize),
        page: pageNumber,
      },
      data: community,
    };

    return res.send(new Success(roleResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not create community"));
  }
}

async function getJoinedCommunity(req, res) {
  const userId = req.user.id;
  try {
    const pageSize = process.env.PAGE_SIZE;
    const pageNumber = parseInt(req.query["page"]) || 1;

    const totalCommunityCount = await Member.countDocuments({ user: userId });

    const skipDocuments = (pageNumber - 1) * pageSize;

    const joinedCommunity = await Member.find({ user: userId })
      .skip(skipDocuments)
      .limit(pageSize)
      .select("community")
      .lean();


    const joinedCommunityList = [];
    for (let i = 0; i < joinedCommunity.length; i++) {
      let { community: communityId } = joinedCommunity[i];

      const community = await Community.findOne({ id: communityId })
        .select("-_id -__v")
        .lean();

      const ownerId = community.owner;
      delete community["owner"];

      const { name } = await User.findOne({ id: ownerId })
        .select("name")
        .lean();

      community.owner = {
        id: communityId,
        name,
      };

      joinedCommunityList.push(community);
    }

    const communityResponseObject = {
      meta: {
        total: totalCommunityCount,
        pages: Math.ceil(totalCommunityCount / pageSize),
        page: pageNumber,
      },
      data: joinedCommunityList,
    };

    return res.send(new Success(communityResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not get joined community"));
  }
}

async function createCommunity(req, res) {
  try {
    const { id: userId } = req.user;

    const { name } = req.body;

    // check if community by a same slug exists
    let community = await Community.findOne({ slug: name });

    if (community) {
      return res.send(new Error("Community already exists"));
    }

    // creating new community
    community = new Community({
      id: Snowflake.generate(),
      name,
      slug: name,
      owner: userId,
    });

    await community.save();

    // adding current user as community admin
    const { id: ownerRoleId } = await Role.findOne({ name: "Community Admin" })
      .select("id")
      .lean();

    const member = new Member({
      id: Snowflake.generate(),
      community: community.id,
      role: ownerRoleId,
      user: userId,
    });

    await member.save();

    // creating response object
    const { id, slug, created_at, updated_at } = community;

    const communityResponseObject = {
      data: {
        id,
        name,
        slug,
        created_at,
        updated_at,
      },
    };

    return res.send(new Success(communityResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not create community"));
  }
}

module.exports = {
  createCommunity,
  getAllCommunity,
  getAllCommunityMembers,
  getOwnedCommunity,
  getJoinedCommunity,
};
