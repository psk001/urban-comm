const { Snowflake } = require("@theinternetfolks/snowflake");

const { Community } = require("../models/communityModel");
const { Success, Error } = require("../utils/response");

// async function getAllCommunity(req, res) {}

// async function getAllCommunityMembers(req, res) {}

async function getOwnedCommunity(req, res) {
  const { id: userId } = req.user;

  try {
    const community = await Community.find({ owner: userId });
    return res.send(new Success(community));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not create community"));
  }
}

// async function getJoinedCommunity(req, res) {}

async function createCommunity(req, res) {
  try {
    const { id: userId } = req.user;

    const { name } = req.body;

    let community = await Community.findOne({ slug: name });

    if (community) {
      return res.send(new Error("Community already exists"));
    }

    community = new Community({
      id: Snowflake.generate(),
      name,
      slug: name,
      owner: userId,
    });

    await community.save();

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
  //   getAllCommunity,
  //   getAllCommunityMembers,
    getOwnedCommunity,
  //   getJoinedCommunity,
};
