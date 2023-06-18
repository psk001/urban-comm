const bcrypt = require("bcrypt");
const { Snowflake } = require("@theinternetfolks/snowflake");

const { User } = require("../models/userModel");

const { Success, Error } = require("../utils/response");

async function signupUser(req, res) {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(400)
        .send(
          new Error(
            "User with this email address already exists.",
            "RESOURCE_EXISTS",
            "email"
          )
        );
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
      return res
        .status(404)
        .send(
          new Error(
            "Please provide a valid email address.",
            "INVALID_INPUT",
            "email"
          )
        );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.send(
        new Error(
          "The credentials you provided are invalid.",
          "INVALID_CREDENTIALS",
          "password"
        )
      );
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
