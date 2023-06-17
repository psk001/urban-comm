const bcrypt = require("bcrypt");
const {Snowflake}= require('@theinternetfolks/snowflake');

const { User } = require("../models/userModel");

const { Success, Error } = require("../utils/response");

async function signupUser(req, res) {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).send(new Error("Email already in use"));
    }

    const passwordHash = bcrypt.hashSync(password, 5);

    user = new User({
      id: Snowflake.generate(),
      name,
      email,
      password: passwordHash,
    });
    await user.save();

    const { id, created_at } = user;

    const userResponseObject = {
      data: {
        id,
        name,
        email,
        created_at,
      },
      meta: {
        access_token: user.generateAuthToken(),
      },
    };

    return res.send(new Success(userResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not register user"));
  }
}

async function signinUser(req, res) {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send(new Error("User does not exist"));
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.send(new Error("Incorrect email or password"));
    }

    const { id, name, created_at } = user;

    const userResponseObject = {
      data: {
        id,
        name,
        email,
        created_at,
      },
      meta: {
        access_token: user.generateAuthToken(),
      },
    };

    return res.send(new Success(userResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not login"));
  }
}

async function getSelf(req, res) {
  try {
    const { id, name, email, created_at } = req.user;

    const userResponseObject = {
      data: {
        id,
        name,
        email,
        created_at,
      },
    };

    return res.send(new Success(userResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not get self"));
  }
}

module.exports = {
  signinUser,
  signupUser,
  getSelf,
};
